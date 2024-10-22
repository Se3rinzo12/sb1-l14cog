import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firestore } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Timestamp;
}

const Messaging: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedReceiver, setSelectedReceiver] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !selectedReceiver) return;

    const q = query(
      collection(firestore, 'messages'),
      where('senderId', 'in', [user.uid, selectedReceiver]),
      where('receiverId', 'in', [user.uid, selectedReceiver]),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [user, selectedReceiver]);

  const sendMessage = async () => {
    if (!user || !selectedReceiver || !newMessage.trim()) return;

    try {
      await addDoc(collection(firestore, 'messages'), {
        senderId: user.uid,
        receiverId: selectedReceiver,
        content: newMessage,
        timestamp: Timestamp.now(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">الرسائل</h1>
      <div className="flex">
        <div className="w-1/3 pr-4">
          {/* Here you would render a list of users to chat with */}
          <button
            onClick={() => setSelectedReceiver('someUserId')}
            className="w-full text-right p-2 hover:bg-gray-100 rounded"
          >
            اسم المستخدم
          </button>
        </div>
        <div className="w-2/3 bg-white rounded-lg shadow-md p-4">
          <div className="h-96 overflow-y-auto mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 ${
                  message.senderId === user?.uid ? 'text-right' : 'text-left'
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.senderId === user?.uid
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {message.content}
                </span>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="اكتب رسالتك هنا..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
            >
              إرسال
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
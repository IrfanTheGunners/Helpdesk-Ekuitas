import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../Components/layout/DashboardLayout';
import initialTickets from '../data/tickets.json';
import initialUsers from '../data/users.json';
import { Send, UserCircle } from 'lucide-react';
import { translateStatus, translatePriority, translateCategory } from '../lib/translator';

const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'status-open bg-[#5A5858]/20 text-[#5A5858] border border-[#5A5858]';
      case 'in progress': return 'status-in-progress bg-[#5A5858]/20 text-[#5A5858] border border-[#5A5858]';
      case 'closed': return 'status-closed bg-[#5A5858]/20 text-[#5A5858] border border-[#5A5858]';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    let allUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(allUsers);

    let allTickets = JSON.parse(localStorage.getItem('tickets')) || initialTickets;
    const currentTicket = allTickets.find(t => t.id === parseInt(ticketId));
    
    if (currentTicket) {
      setTicket(currentTicket);
    } else {
      navigate('/tickets');
    }
  }, [ticketId, navigate]);

  const updateTicketInStorage = (updatedTicket, notificationMessage) => {
    let allTickets = JSON.parse(localStorage.getItem('tickets')) || initialTickets;
    const ticketIndex = allTickets.findIndex(t => t.id === updatedTicket.id);
    if (ticketIndex !== -1) {
        allTickets[ticketIndex] = updatedTicket;
        localStorage.setItem('tickets', JSON.stringify(allTickets));
        window.dispatchEvent(new Event('ticketsUpdated')); // Dispatch event
    }

    // Create notification if a message is provided
    if (notificationMessage && currentUser.id !== updatedTicket.userId) {
        const allNotifs = JSON.parse(localStorage.getItem('notifications')) || [];
        const nextNotifId = (allNotifs.length > 0 ? Math.max(...allNotifs.map(n => n.id)) : 0) + 1;
        allNotifs.push({
            id: nextNotifId,
            userId: updatedTicket.userId, // Notify the user who created the ticket
            message: notificationMessage,
            link: `/ticket/${updatedTicket.id}`,
            isRead: false,
            createdAt: new Date().toISOString(),
        });
        localStorage.setItem('notifications', JSON.stringify(allNotifs));
        window.dispatchEvent(new Event('notificationsUpdated'));
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser) return;

    const comment = {
      id: (ticket.comments.length > 0 ? Math.max(...ticket.comments.map(c => c.id)) : 0) + 1,
      userId: currentUser.id,
      comment: newComment,
      createdAt: new Date().toISOString(),
    };

    const updatedTicket = { 
        ...ticket, 
        comments: [...ticket.comments, comment],
        updatedAt: new Date().toISOString(),
        agentId: ticket.agentId || (currentUser.role === 'agent' ? currentUser.id : null)
    };
    setTicket(updatedTicket);
    const notifMessage = `Ada balasan baru di tiket "${ticket.title}".`;
    updateTicketInStorage(updatedTicket, notifMessage);
    setNewComment('');
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    const updatedTicket = { 
        ...ticket, 
        status: newStatus,
        updatedAt: new Date().toISOString(),
        agentId: ticket.agentId || (currentUser.role === 'agent' ? currentUser.id : null)
    };
    setTicket(updatedTicket);
    const notifMessage = `Status tiket "${ticket.title}" diubah menjadi ${translateStatus(newStatus)}.`;
    updateTicketInStorage(updatedTicket, notifMessage);
  }

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tiket ini secara permanen?')) {
        let allTickets = JSON.parse(localStorage.getItem('tickets')) || [];
        const updatedTickets = allTickets.filter(t => t.id !== ticket.id);
        localStorage.setItem('tickets', JSON.stringify(updatedTickets));
        window.dispatchEvent(new Event('ticketsUpdated'));
        navigate('/tickets');
    }
  }

  const getUserName = (userId) => users.find(u => u.id === userId)?.name || 'Belum Ditugaskan';

  if (!ticket || !currentUser) {
    return <DashboardLayout><p>Memuat tiket...</p></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <div className='bg-white border border-gray-300 rounded-lg p-6 shadow-sm'>
                <h1 className="text-3xl font-bold mb-2" style={{color: '#5A5858'}}>{ticket.title}</h1>
                <p className="text-gray-600" style={{color: '#5A5858'}}>{ticket.description}</p>
            </div>

            <h2 className="text-2xl font-semibold my-6" style={{color: '#5A5858'}}>Percakapan</h2>

            <div className="space-y-6">
                {ticket.comments.map(comment => (
                    <div key={comment.id} className="flex gap-4">
                        <UserCircle size={36} className="text-gray-500 mt-1"/>
                        <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-bold" style={{color: '#5A5858'}}>{getUserName(comment.userId)}</p>
                                <p className="text-xs" style={{color: '#5A5858'}}>{new Date(comment.createdAt).toLocaleString('id-ID')}</p>
                            </div>
                            <p className="text-gray-700" style={{color: '#5A5858'}}>{comment.comment}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex gap-4">
                 <UserCircle size={36} className="text-gray-500 mt-3"/>
                 <div className="flex-1 relative">
                    <textarea 
                        className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-16" 
                        placeholder="Ketik balasan Anda..."
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{color: '#5A5858'}}
                    />
                    <button onClick={handleAddComment} className="absolute right-3 bottom-3 p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white">
                        <Send size={20}/>
                    </button>
                 </div>
            </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-300 rounded-lg p-6 sticky top-24 shadow-sm">
            <h2 className="text-2xl font-bold mb-6" style={{color: '#5A5858'}}>Detail Tiket</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold mb-1" style={{color: '#5A5858'}}>Status</h3>
                    {currentUser.role === 'agent' ? (
                        <select onChange={handleStatusChange} value={ticket.status} className={`w-full px-3 py-2 text-md font-bold rounded-lg focus:outline-none ${getStatusBadge(ticket.status)} border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white`}>
                            <option className="bg-white" style={{color: '#5A5858'}} value="Open">Terbuka</option>
                            <option className="bg-white" style={{color: '#5A5858'}} value="In Progress">Dikerjakan</option>
                            <option className="bg-white" style={{color: '#5A5858'}} value="Closed">Selesai</option>
                        </select>
                    ) : (
                        <p className={`inline-block px-3 py-1 text-md font-bold rounded-full ${getStatusBadge(ticket.status)}`}>{translateStatus(ticket.status)}</p>
                    )}
                </div>
                 <div>
                    <h3 className="font-semibold mb-1" style={{color: '#5A5858'}}>Prioritas</h3>
                    <p style={{color: '#5A5858'}}>{translatePriority(ticket.priority)}</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-1" style={{color: '#5A5858'}}>Waktu Penyelesaian (SLA)</h3>
                    <div className="space-y-1">
                        {ticket.priority === 'Tinggi' && (
                            <p className="text-red-600 font-bold">1 jam</p>
                        )}
                        {ticket.priority === 'Sedang' && (
                            <p className="text-yellow-600 font-bold">30 menit</p>
                        )}
                        {ticket.priority === 'Rendah' && (
                            <p className="text-green-600 font-bold">15 menit</p>
                        )}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-1" style={{color: '#5A5858'}}>Kategori</h3>
                    <p style={{color: '#5A5858'}}>{translateCategory(ticket.category)}</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-1" style={{color: '#5A5858'}}>Pembuat Tiket</h3>
                    <p style={{color: '#5A5858'}}>{getUserName(ticket.userId)}</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-1" style={{color: '#5A5858'}}>Ditugaskan kepada</h3>
                    <p className="font-semibold" style={{color: '#5A5858'}}>{getUserName(ticket.agentId)}</p>
                </div>
                 <div>
                    <h3 className="font-semibold mb-1" style={{color: '#5A5858'}}>Dibuat Pada</h3>
                    <p style={{color: '#5A5858'}}>{new Date(ticket.createdAt).toLocaleDateString('id-ID')}</p>
                </div>

                {/* Delete Button - only for ticket owner on closed tickets */}
                {currentUser.id === ticket.userId && ticket.status === 'Closed' && (
                    <div className="border-t border-gray-300 pt-4 mt-4">
                        <button 
                            onClick={handleDelete}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors"
                        >
                            Hapus Tiket Ini
                        </button>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TicketDetailPage;
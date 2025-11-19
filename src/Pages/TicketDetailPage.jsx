import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../Components/layout/DashboardLayout';
import initialTickets from '../data/tickets.json';
import { Send, UserCircle, FileText, MessageCircleMore } from 'lucide-react';
import { translateStatus, translatePriority, translateCategory } from '../lib/translator';

const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'status-open bg-[#49B6B0]/20 text-[#49B6B0] border border-[#49B6B0]';
      case 'in progress': return 'status-in-progress bg-[#1577B6]/20 text-[#1577B6] border border-[#1577B6]';
      case 'closed': return 'status-closed bg-[#6FD36A]/20 text-[#6FD36A] border border-[#6FD36A]';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getPriorityBadge = (priority) => {
      switch (priority?.toLowerCase()) {
        case 'high': return 'border-red-500/50 text-red-400';
        case 'medium': return 'border-yellow-500/50 text-yellow-400';
        case 'low': return 'border-green-500/50 text-green-400';
        default: return 'border-gray-500/50 text-gray-400';
      }
  };

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newNote, setNewNote] = useState('');

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

  const updateTicketInStorage = (updatedTicket, notificationMessage, notificationType = 'ticket') => {
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
            type: notificationType,
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

  const handleAddNote = () => {
    if (!newNote.trim() || !currentUser) return;

    const note = {
      id: (ticket.notes?.length > 0 ? Math.max(...ticket.notes.map(n => n.id)) : 0) + 1,
      userId: currentUser.id,
      note: newNote,
      createdAt: new Date().toISOString(),
    };

    const updatedTicket = {
        ...ticket,
        notes: [...(ticket.notes || []), note],
        updatedAt: new Date().toISOString(),
        agentId: ticket.agentId || (currentUser.role === 'agent' ? currentUser.id : null)
    };
    setTicket(updatedTicket);
    const notifMessage = `Ada catatan baru di tiket "${ticket.title}".`;
    updateTicketInStorage(updatedTicket, notifMessage, 'note'); // Gunakan tipe notifikasi 'note'
    setNewNote('');
  };

  const handleStatusChange = (e) => {
    // Validasi bahwa hanya agent yang ditugaskan yang bisa mengubah status tiket
    if (currentUser?.role === 'agent' && ticket?.agentId && ticket.agentId !== currentUser.id) {
      alert('Hanya agent yang ditugaskan ke tiket ini yang dapat mengubah status tiket.');
      // Kembalikan nilai status ke semula
      e.target.value = ticket.status;
      return;
    }

    const newStatus = e.target.value;
    const updatedTicket = { 
        ...ticket, 
        status: newStatus,
        updatedAt: new Date().toISOString(),
        agentId: ticket.agentId || (currentUser.role === 'agent' ? currentUser.id : null)
    };
    setTicket(updatedTicket);
    
    // Create notification for the ticket owner
    const notifMessage = `Status tiket "${ticket.title}" diubah menjadi ${translateStatus(newStatus)}.`;
    updateTicketInStorage(updatedTicket, notifMessage);
    
    // Create notification for admins about status change if it's a significant change
    if (newStatus === 'Closed' || newStatus === 'In Progress') {
        const allNotifs = JSON.parse(localStorage.getItem('notifications')) || [];
        const allUsers = JSON.parse(localStorage.getItem('users')) || [];
        let nextNotifId = (allNotifs.length > 0 ? Math.max(...allNotifs.map(n => n.id)) : 0) + 1;
        
        const admins = allUsers.filter(u => u.role === 'admin' || u.role === 'superadmin');
        admins.forEach(admin => {
          allNotifs.push({
            id: nextNotifId++,
            userId: admin.id,
            type: 'management',
            message: `Tiket "${ticket.title}" statusnya diubah menjadi ${translateStatus(newStatus)} oleh ${currentUser.name}.`,
            link: `/admin/tickets`,
            isRead: false,
            createdAt: new Date().toISOString(),
          });
        });
        
        localStorage.setItem('notifications', JSON.stringify(allNotifs));
        window.dispatchEvent(new Event('notificationsUpdated'));
    }
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
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2" style={{color: '#5A5858'}}>{ticket.title}</h1>
                <p className="text-gray-700 leading-relaxed" style={{color: '#5A5858'}}>{ticket.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className={`px-3 py-1 font-bold rounded-full text-sm ${getStatusBadge(ticket.status)}`}>
                {translateStatus(ticket.status)}
              </div>
              <div className={`px-3 py-1 font-semibold rounded-full text-sm border ${getPriorityBadge(ticket.priority)}`}>
                {translatePriority(ticket.priority)}
              </div>
              <span className="text-sm text-gray-600">
                Dibuat: {new Date(ticket.createdAt).toLocaleDateString('id-ID')}
              </span>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MessageCircleMore size={24} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-bold" style={{color: '#5A5858'}}>Percakapan</h2>
              </div>
              
              <div className="space-y-6">
                {ticket.comments.map(comment => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserCircle size={20} className="text-gray-600"/>
                    </div>
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold" style={{color: '#5A5858'}}>{getUserName(comment.userId)}</p>
                        <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString('id-ID')}</p>
                      </div>
                      <p className="text-gray-700" style={{color: '#5A5858'}}>{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Notes Section - Visible only to the agent handling the ticket and the ticket owner */}
              {((currentUser.role === 'agent' && ticket.agentId === currentUser.id) || 
               currentUser.role === 'admin' || 
               currentUser.role === 'superadmin' || 
               currentUser.id === ticket.userId) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <FileText size={24} className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold" style={{color: '#5A5858'}}>Catatan (Notes)</h3>
                  </div>

                  <div className="space-y-4 mb-6">
                    {(ticket.notes || []).map(note => (
                      <div key={note.id} className="flex gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                          </svg>
                        </div>
                        <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-bold" style={{color: '#5A5858'}}>Catatan oleh {getUserName(note.userId)}</p>
                            <p className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleString('id-ID')}</p>
                          </div>
                          <p className="text-gray-700" style={{color: '#5A5858'}}>{note.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Form input notes hanya untuk agent yang menangani tiket */}
                  {currentUser.role === 'agent' && ticket.agentId === currentUser.id && (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                        </svg>
                      </div>
                      <div className="flex-1 relative">
                        <textarea
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 resize-y focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-16 h-24"
                          placeholder="Tambahkan catatan atau tindak lanjut untuk user..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          style={{color: '#5A5858'}}
                        />
                        <button
                          onClick={handleAddNote}
                          className="absolute right-3 bottom-3 p-2 bg-green-600 hover:bg-green-700 rounded-full text-white shadow-md"
                        >
                          <Send size={20}/>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Send size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold" style={{color: '#5A5858'}}>Tambahkan Balasan</h3>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserCircle size={20} className="text-gray-600"/>
                  </div>
                  <div className="flex-1 relative">
                    <textarea 
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-16 h-24" 
                      placeholder="Ketik balasan Anda..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      style={{color: '#5A5858'}}
                    />
                    <button 
                      onClick={handleAddComment} 
                      className="absolute right-3 bottom-3 p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white shadow-md"
                    >
                      <Send size={20}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileText size={24} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-bold" style={{color: '#5A5858'}}>Detail Tiket</h2>
            </div>
            
            <div className="space-y-5">
              <div className="pb-4 border-b border-gray-100">
                <h3 className="font-semibold mb-2 text-gray-700" style={{color: '#5A5858'}}>Status</h3>
                {currentUser.role === 'agent' ? (
                  <select 
                    onChange={handleStatusChange} 
                    value={ticket.status} 
                    disabled={ticket.agentId !== null && ticket.agentId !== currentUser.id}
                    className={`w-full px-3 py-2 text-md font-bold rounded-lg focus:outline-none ${getStatusBadge(ticket.status)} border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${ticket.agentId !== null && ticket.agentId !== currentUser.id ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <option className="bg-white" style={{color: '#5A5858'}} value="Open">Terbuka</option>
                    <option className="bg-white" style={{color: '#5A5858'}} value="In Progress">Dikerjakan</option>
                    <option className="bg-white" style={{color: '#5A5858'}} value="Closed">Selesai</option>
                  </select>
                ) : (
                  <p className={`inline-block px-3 py-1 text-md font-bold rounded-full ${getStatusBadge(ticket.status)}`}>{translateStatus(ticket.status)}</p>
                )}
              </div>
              
              <div className="pb-4 border-b border-gray-100">
                <h3 className="font-semibold mb-2 text-gray-700" style={{color: '#5A5858'}}>Prioritas</h3>
                <p className={`px-3 py-1 inline-block rounded-full ${getPriorityBadge(ticket.priority)} border`}>{translatePriority(ticket.priority)}</p>
              </div>

              
              <div className="pb-4 border-b border-gray-100">
                <h3 className="font-semibold mb-2 text-gray-700" style={{color: '#5A5858'}}>Kategori</h3>
                <p className="bg-gray-100 px-3 py-1 rounded-full inline-block">{translateCategory(ticket.category)}</p>
              </div>
              
              <div className="pb-4 border-b border-gray-100">
                <h3 className="font-semibold mb-2 text-gray-700" style={{color: '#5A5858'}}>Pembuat Tiket</h3>
                <p className="font-semibold text-gray-800" style={{color: '#5A5858'}}>{getUserName(ticket.userId)}</p>
              </div>

              
              <div className="pb-4 border-b border-gray-100">
                <h3 className="font-semibold mb-2 text-gray-700" style={{color: '#5A5858'}}>Ditugaskan kepada</h3>
                <p className="font-semibold text-gray-800" style={{color: '#5A5858'}}>{getUserName(ticket.agentId)}</p>
              </div>
              
              <div className="pb-4 border-b border-gray-100">
                <h3 className="font-semibold mb-2 text-gray-700" style={{color: '#5A5858'}}>Dibuat Pada</h3>
                <p className="text-gray-700">{new Date(ticket.createdAt).toLocaleDateString('id-ID')}</p>
              </div>

              {/* Delete Button - only for ticket owner on closed tickets */}
              {currentUser.id === ticket.userId && ticket.status === 'Closed' && (
                <div className="pt-4">
                  <button 
                    onClick={handleDelete}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors shadow-md"
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
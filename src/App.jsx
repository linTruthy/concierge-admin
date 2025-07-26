import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { 
  Users, 
  MessageSquare, 
  Bell, 
  Settings, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Mail,
  Calendar,
  Send
} from 'lucide-react'
import './App.css'

// Mock data
const mockRequests = [
  {
    id: 'req_1',
    title: 'Dinner Reservation',
    description: 'Please book a table for 4 at Le Bernardin for Friday evening at 8 PM.',
    category: 'dining',
    priority: 'normal',
    status: 'completed',
    clientName: 'Alexander Sterling',
    clientEmail: 'alexander.sterling@example.com',
    createdAt: new Date('2025-07-23'),
    updatedAt: new Date('2025-07-25'),
    notes: ['Reservation confirmed for 8:00 PM', 'Table 12 reserved'],
  },
  {
    id: 'req_2',
    title: 'Flight Booking',
    description: 'Need first-class tickets to Paris for next month. Flexible dates between 15th-20th.',
    category: 'travel',
    priority: 'urgent',
    status: 'inProgress',
    clientName: 'Alexander Sterling',
    clientEmail: 'alexander.sterling@example.com',
    createdAt: new Date('2025-07-24'),
    updatedAt: new Date('2025-07-26'),
    notes: ['Checking availability with Air France', 'Found options for 17th and 19th'],
  },
  {
    id: 'req_3',
    title: 'Personal Shopping',
    description: 'Looking for a special gift for my wife\'s birthday. Something elegant from Cartier or Tiffany.',
    category: 'shopping',
    priority: 'normal',
    status: 'received',
    clientName: 'Alexander Sterling',
    clientEmail: 'alexander.sterling@example.com',
    createdAt: new Date('2025-07-26'),
    notes: [],
  },
]

const mockClients = [
  {
    id: 'user_1',
    fullName: 'Alexander Sterling',
    email: 'alexander.sterling@example.com',
    phoneNumber: '+1 (555) 123-4567',
    preferences: {
      favoriteRestaurants: 'Le Bernardin, Eleven Madison Park',
      preferredBrands: 'Hermès, Cartier, Brunello Cucinelli',
      travelNotes: 'Prefers first-class, non-smoking rooms, late checkout',
    },
    totalRequests: 3,
    completedRequests: 1,
    vipStatus: true,
  },
]

const mockMessages = [
  {
    id: 'msg_1',
    requestId: 'req_2',
    message: 'I need first-class tickets to Paris for next month.',
    sender: 'client',
    timestamp: new Date('2025-07-24T10:00:00'),
  },
  {
    id: 'msg_2',
    requestId: 'req_2',
    message: 'I\'ll check availability with our preferred airlines. Do you have any specific date preferences?',
    sender: 'admin',
    timestamp: new Date('2025-07-24T11:00:00'),
  },
  {
    id: 'msg_3',
    requestId: 'req_2',
    message: 'Flexible between 15th-20th of next month. Prefer Air France if possible.',
    sender: 'client',
    timestamp: new Date('2025-07-25T06:00:00'),
  },
  {
    id: 'msg_4',
    requestId: 'req_2',
    message: 'Perfect! I found excellent options on the 17th and 19th with Air France. Both have first-class availability. Which would you prefer?',
    sender: 'admin',
    timestamp: new Date('2025-07-26T06:00:00'),
  },
]

function LoginScreen({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' })

  const handleLogin = (e) => {
    e.preventDefault()
    // Simple mock authentication
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      onLogin(true)
    } else {
      alert('Invalid credentials. Use admin/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-serif">Concierge Admin</CardTitle>
          <CardDescription>Sign in to manage client requests</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Enter password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Demo credentials: admin / admin
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function Dashboard() {
  const [requests, setRequests] = useState(mockRequests)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const getStatusColor = (status) => {
    switch (status) {
      case 'received': return 'bg-blue-100 text-blue-800'
      case 'inProgress': return 'bg-orange-100 text-orange-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    return priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'travel': return '✈️'
      case 'dining': return '🍽️'
      case 'shopping': return '🛍️'
      case 'event': return '🎉'
      case 'errand': return '🏃'
      default: return '❓'
    }
  }

  const filteredRequests = requests.filter(req => 
    statusFilter === 'all' || req.status === statusFilter
  )

  const updateRequestStatus = (requestId, newStatus) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: newStatus, updatedAt: new Date() }
        : req
    ))
  }

  const addNote = (requestId, note) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, notes: [...req.notes, note], updatedAt: new Date() }
        : req
    ))
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedRequest) return

    const message = {
      id: `msg_${Date.now()}`,
      requestId: selectedRequest.id,
      message: newMessage,
      sender: 'admin',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const requestMessages = messages.filter(msg => msg.requestId === selectedRequest?.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-serif font-semibold text-gray-900">
            Concierge Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Avatar>
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Requests
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <User className="h-4 w-4 mr-2" />
              Clients
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs defaultValue="requests" className="space-y-6">
            <TabsList>
              <TabsTrigger value="requests">Requests Management</TabsTrigger>
              <TabsTrigger value="clients">Client Profiles</TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Clock className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {requests.filter(r => r.status === 'received').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <AlertCircle className="h-8 w-8 text-orange-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">In Progress</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {requests.filter(r => r.status === 'inProgress').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Completed</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {requests.filter(r => r.status === 'completed').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Requests</p>
                        <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Requests List */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Requests</CardTitle>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="received">Received</SelectItem>
                          <SelectItem value="inProgress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {filteredRequests.map((request) => (
                      <div
                        key={request.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedRequest?.id === request.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedRequest(request)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">{getCategoryIcon(request.category)}</span>
                              <h3 className="font-medium text-gray-900">{request.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                              {request.priority === 'urgent' && (
                                <Badge className={getPriorityColor(request.priority)}>
                                  URGENT
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {request.clientName} • {request.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Request Detail */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedRequest ? 'Request Details' : 'Select a Request'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedRequest ? (
                      <div className="space-y-6">
                        {/* Request Info */}
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">{selectedRequest.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">{selectedRequest.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <Label className="text-xs text-gray-500">Status</Label>
                              <Select 
                                value={selectedRequest.status} 
                                onValueChange={(value) => updateRequestStatus(selectedRequest.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="received">Received</SelectItem>
                                  <SelectItem value="inProgress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500">Priority</Label>
                              <p className="text-sm font-medium">{selectedRequest.priority}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <Label className="text-xs text-gray-500">Client</Label>
                            <p className="text-sm font-medium">{selectedRequest.clientName}</p>
                            <p className="text-xs text-gray-500">{selectedRequest.clientEmail}</p>
                          </div>
                        </div>

                        {/* Progress Notes */}
                        <div>
                          <Label className="text-sm font-medium">Progress Notes</Label>
                          <div className="mt-2 space-y-2">
                            {selectedRequest.notes.map((note, index) => (
                              <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                • {note}
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 flex space-x-2">
                            <Input 
                              placeholder="Add a note..." 
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                  addNote(selectedRequest.id, e.target.value)
                                  e.target.value = ''
                                }
                              }}
                            />
                          </div>
                        </div>

                        {/* Chat */}
                        <div>
                          <Label className="text-sm font-medium">Chat with Client</Label>
                          <div className="mt-2 border rounded-lg p-4 h-64 overflow-y-auto bg-gray-50">
                            {requestMessages.map((message) => (
                              <div
                                key={message.id}
                                className={`mb-3 ${
                                  message.sender === 'admin' ? 'text-right' : 'text-left'
                                }`}
                              >
                                <div
                                  className={`inline-block p-2 rounded-lg max-w-xs ${
                                    message.sender === 'admin'
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-white text-gray-900'
                                  }`}
                                >
                                  <p className="text-sm">{message.message}</p>
                                  <p className="text-xs opacity-75 mt-1">
                                    {message.timestamp.toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 flex space-x-2">
                            <Input
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="Type your message..."
                              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            />
                            <Button onClick={sendMessage} size="sm">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Select a request to view details and chat with the client</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="clients" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Profiles</CardTitle>
                  <CardDescription>Manage client information and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockClients.map((client) => (
                      <div key={client.id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="text-lg">
                                {client.fullName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium text-gray-900 flex items-center">
                                {client.fullName}
                                {client.vipStatus && (
                                  <Badge className="ml-2 bg-yellow-100 text-yellow-800">VIP</Badge>
                                )}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Mail className="h-4 w-4 mr-1" />
                                  {client.email}
                                </span>
                                <span className="flex items-center">
                                  <Phone className="h-4 w-4 mr-1" />
                                  {client.phoneNumber}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {client.totalRequests} total requests
                            </p>
                            <p className="text-sm text-gray-600">
                              {client.completedRequests} completed
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Favorite Restaurants</Label>
                            <p className="text-sm text-gray-600 mt-1">{client.preferences.favoriteRestaurants}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Preferred Brands</Label>
                            <p className="text-sm text-gray-600 mt-1">{client.preferences.preferredBrands}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Travel Notes</Label>
                            <p className="text-sm text-gray-600 mt-1">{client.preferences.travelNotes}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return <LoginScreen onLogin={setIsAuthenticated} />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App


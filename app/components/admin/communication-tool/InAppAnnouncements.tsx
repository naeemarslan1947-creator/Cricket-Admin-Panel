import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'

const InAppAnnouncements = ({announcements,setShowNewAnnouncement, showNewAnnouncement }) => {
  return (
    <Card className="border-[#e2e8f0] ">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#1e293b]">In-App Announcements</CardTitle>
                  <p className="text-sm text-[#64748b]">Display banners and modals within the app</p>
                </div>
                <Button 
                  className="bg-[#00C853] hover:bg-[#00a844] text-white"
                  onClick={() => setShowNewAnnouncement(!showNewAnnouncement)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Announcement
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* New Announcement Form */}
              {showNewAnnouncement && (
                <Card className="border-[#00C853] bg-green-50">
                  <CardContent className="p-4 space-y-4">
                    <h4 className="text-[#1e293b]">Create In-App Announcement</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="ann-title">Announcement Title</Label>
                        <Input 
                          id="ann-title" 
                          placeholder="e.g., Welcome to Crickit!" 
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <Label htmlFor="ann-content">Content</Label>
                        <textarea 
                          id="ann-content" 
                          placeholder="Enter announcement content..." 
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg min-h-[120px]"
                        />
                      </div>

                      <div>
                        <Label htmlFor="ann-display">Display Type</Label>
                        <select id="ann-display" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="banner">Top Banner</option>
                          <option value="modal">Popup Modal</option>
                          <option value="bottom">Bottom Banner</option>
                          <option value="sidebar">Sidebar Card</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="ann-style">Style</Label>
                        <select id="ann-style" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="info">Info (Blue)</option>
                          <option value="success">Success (Green)</option>
                          <option value="warning">Warning (Orange)</option>
                          <option value="promo">Promotional (Purple)</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="ann-start">Start Date</Label>
                        <Input 
                          id="ann-start" 
                          type="datetime-local" 
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="ann-end">End Date</Label>
                        <Input 
                          id="ann-end" 
                          type="datetime-local" 
                          className="mt-1"
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="ann-action">Action Button Text (Optional)</Label>
                        <Input 
                          id="ann-action" 
                          placeholder="e.g., Learn More" 
                          className="mt-1"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="ann-dismissible" className="rounded" defaultChecked />
                        <Label htmlFor="ann-dismissible">User can dismiss</Label>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-[#e2e8f0]">
                      <Button className="bg-[#00C853] hover:bg-[#00a844] text-white">
                        Create Announcement
                      </Button>
                      <Button variant="outline">Preview</Button>
                      <Button variant="outline" onClick={() => setShowNewAnnouncement(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Active Announcements */}
              <div>
                <h4 className="text-[#1e293b] mb-3">Active & Scheduled Announcements</h4>
                <div className="space-y-3">
                  {announcements.map((announcement) => (
                    <Card key={announcement.id} className="border-[#e2e8f0]">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-[#1e293b]">{announcement.title}</h4>
                              <Badge className={announcement.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                                {announcement.status}
                              </Badge>
                              <Badge variant="outline">{announcement.displayLocation}</Badge>
                            </div>
                            <p className="text-sm text-[#64748b] mb-2">{announcement.content}</p>
                            <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
                              <span>{announcement.views.toLocaleString()} views</span>
                              <span>{announcement.startDate} - {announcement.endDate}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-[#e2e8f0]">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-red-200 text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
  )
}

export default InAppAnnouncements
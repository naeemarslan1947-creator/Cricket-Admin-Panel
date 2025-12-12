"use client";

import { Badge } from '@/app/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { Search, Users } from 'lucide-react'
import React from 'react'

interface Club {
  id: number
  name: string
  location: string
  members: number
  searches: number
}
interface MostSearchedClubsProps {
  mostSearchedClubs: Club[]
}
const MostSearchedClubs: React.FC<MostSearchedClubsProps> = ({ mostSearchedClubs }) => {
  return (
    <Card className="border-[#e2e8f0] ">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#1e293b] mb-1">Most Searched Clubs</CardTitle>
            <p className="text-sm text-[#64748b]">Top clubs by search volume</p>
          </div>
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 flex items-center gap-1">
            <Search className="w-3 h-3" />
            56.2K Total Searches
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Club Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Searches</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {mostSearchedClubs.map((club, index) => (
              <TableRow key={club.id}>
                <TableCell className="py-4">
                  <Badge
                    className={`${
                      index === 0
                        ? "bg-yellow-100 text-yellow-800"
                        : index === 1
                        ? "bg-gray-100 text-gray-800"
                        : index === 2
                        ? "bg-orange-100 text-orange-800"
                        : "bg-blue-100 text-blue-800"
                    } hover:bg-current`}
                  >
                    {index + 1}
                  </Badge>
                </TableCell>

                <TableCell className="font-medium text-[#1e293b] py-4">
                  {club.name}
                </TableCell>

                <TableCell className="text-[#64748b] py-4">
                  {club.location}
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#64748b]" />
                    <span className="text-[#1e293b]">
                      {club.members.toLocaleString()}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#64748b]" />
                    <span className="font-medium text-[#1e293b]">
                      {club.searches.toLocaleString()}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </CardContent>
    </Card>
  )
}

export default MostSearchedClubs

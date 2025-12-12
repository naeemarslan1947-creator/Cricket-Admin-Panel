import React from 'react'
import { Card, CardContent } from '../../ui/card'
import { CreditCard, DollarSign, TrendingUp, Users } from 'lucide-react'

const SummaryCard = () => {
  return (
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#e2e8f0] ">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b]">Active Premium</p>
                <p className="text-2xl text-[#1e293b] mt-1">342</p>
              </div>
              <Users className="w-8 h-8 text-[#007BFF]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0] ">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b]">Monthly Revenue</p>
                <p className="text-2xl text-[#1e293b] mt-1">$10,258</p>
              </div>
              <DollarSign className="w-8 h-8 text-[#00C853]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0] ">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b]">Trials Ending</p>
                <p className="text-2xl text-[#1e293b] mt-1">23</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#f59e0b]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0] ">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b]">Conversion Rate</p>
                <p className="text-2xl text-[#1e293b] mt-1">18.2%</p>
              </div>
              <CreditCard className="w-8 h-8 text-[#007BFF]" />
            </div>
          </CardContent>
        </Card>
      </div>
  )
}

export default SummaryCard
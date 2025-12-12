"use client";

import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Eye } from "lucide-react";
import React from "react";

type ViewedPost = {
  id: string | number;
  title: string;
  author: string;
  views: number;
  date: string;
};

interface MostViewedPostsProps {
  mostViewedPosts: ViewedPost[];
}

const MostViewedPosts: React.FC<MostViewedPostsProps> = ({ mostViewedPosts }) => {
  return (
    <Card className="border-[#e2e8f0]">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#1e293b] mb-1">Most Viewed Posts</CardTitle>
            <p className="text-sm text-[#64748b]">Top content by view count</p>
          </div>

          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
            <Eye className="w-3 h-3" />
            48.8K Total Views
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Post Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {mostViewedPosts.map((post, index) => (
              <TableRow key={post.id}>
                <TableCell className="py-4">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    {index + 1}
                  </Badge>
                </TableCell>

                <TableCell className="font-medium text-[#1e293b] py-4">
                  {post.title}
                </TableCell>

                <TableCell className="text-[#64748b] py-4">
                  {post.author}
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#64748b]" />
                    <span className="font-medium text-[#1e293b]">
                      {post.views.toLocaleString()}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-[#64748b] py-4">
                  {post.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MostViewedPosts;

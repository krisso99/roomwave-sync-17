
import React from 'react';
import { format } from 'date-fns';
import { MessageSquare, User, Hotel, Bell } from 'lucide-react';
import { Message } from '@/contexts/BookingContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No messages yet</h3>
        <p className="text-muted-foreground mt-2">
          Send a message to start communicating with the guest.
        </p>
      </div>
    );
  }

  const sortedMessages = [...messages].sort((a, b) => 
    a.timestamp.getTime() - b.timestamp.getTime()
  );

  return (
    <div className="space-y-4">
      {sortedMessages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3",
            message.sender === 'guest' ? "justify-start" : message.sender === 'host' ? "justify-start" : "justify-start"
          )}
        >
          <div className="flex-shrink-0 mt-1">
            {message.sender === 'guest' ? (
              <Avatar className="h-8 w-8 border bg-blue-50">
                <AvatarFallback className="bg-blue-100 text-blue-700">G</AvatarFallback>
              </Avatar>
            ) : message.sender === 'host' ? (
              <Avatar className="h-8 w-8 border">
                <AvatarFallback className="bg-green-100 text-green-700">H</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-8 w-8 border">
                <AvatarFallback className="bg-gray-100"><Bell className="h-4 w-4 text-gray-600" /></AvatarFallback>
              </Avatar>
            )}
          </div>
          
          <div className={cn(
            "rounded-lg px-4 py-2 max-w-[80%]",
            message.sender === 'guest' 
              ? "bg-blue-50 text-blue-900" 
              : message.sender === 'host'
                ? "bg-green-50 text-green-900" 
                : "bg-gray-100 text-gray-800"
          )}>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">
                {message.sender === 'guest' 
                  ? 'Guest' 
                  : message.sender === 'host' 
                    ? 'Staff' 
                    : 'System'}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(message.timestamp, "MMM d, yyyy • h:mm a")}
              </span>
            </div>
            <div className="whitespace-pre-line text-sm">{message.content}</div>
            
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 pt-2 border-t border-muted">
                {message.attachments.map((attachment, index) => (
                  <div key={index} className="text-xs text-blue-600 underline">
                    {attachment}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

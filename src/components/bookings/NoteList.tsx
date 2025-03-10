
import React from 'react';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import { BookingNote } from '@/contexts/BookingContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface NoteListProps {
  notes: BookingNote[];
}

export const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No notes yet</h3>
        <p className="text-muted-foreground mt-2">
          Add a note to keep track of important information about this booking.
        </p>
      </div>
    );
  }

  const sortedNotes = [...notes].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <div className="space-y-4">
      {sortedNotes.map((note) => (
        <div
          key={note.id}
          className="border rounded-lg p-4 bg-muted/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {note.author.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{note.author}</span>
            <span className="text-xs text-muted-foreground">
              {format(note.timestamp, "MMM d, yyyy • h:mm a")}
            </span>
          </div>
          <p className="text-sm whitespace-pre-line">{note.content}</p>
        </div>
      ))}
    </div>
  );
};

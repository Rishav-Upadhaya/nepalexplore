import { VirtualPostcardCreator } from '@/components/virtual-postcards/VirtualPostcardCreator';
import type { Metadata } from 'next';

// Static metadata for the Virtual Postcards page
export const metadata: Metadata = {
  title: 'Create Virtual Postcards from Nepal | Visit Nepal',
  description: 'Upload your Nepal travel photos and let AI generate captions for virtual postcards. Share your Nepal tour memories easily.',
  keywords: ['Virtual Postcards', 'Nepal Photos', 'AI Caption Generator', 'Share Nepal Travel', 'Nepal Memories', 'Travel Postcards'],
   openGraph: {
      title: 'Create Virtual Postcards from Nepal | Visit Nepal',
      description: 'Upload your Nepal travel photos and let AI generate captions.',
    },
     twitter: {
        title: 'Create Virtual Postcards from Nepal | Visit Nepal',
        description: 'Upload your Nepal travel photos and let AI generate captions.',
    }
};


export default function VirtualPostcardsPage() {
  return <VirtualPostcardCreator />;
}

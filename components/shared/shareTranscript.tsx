import { Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useState } from 'react';

interface ShareTranscriptProps {
  text: string;
  bgColor: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

const ShareTranscript = ({ text, bgColor, cardRef }: ShareTranscriptProps) => {
  const [isSharing, setIsSharing] = useState(false);

  const generateImage = async () => {
    if (!cardRef.current) return null;

    // Temporarily hide the icons
    const icons = cardRef.current.querySelector('.action-icons');
    if (icons) icons.classList.add('hidden');

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: bgColor.replace('/90', ''),
        scale: 2,
      });

      // Show the icons again
      if (icons) icons.classList.remove('hidden');

      return canvas;
    } catch (error) {
      console.error('Error generating image:', error);
      if (icons) icons.classList.remove('hidden');
      return null;
    }
  };

  const shareToSocial = async (platform: 'facebook' | 'twitter') => {
    setIsSharing(true);
    const canvas = await generateImage();
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), 'image/png')
      );

      const formData = new FormData();
      formData.append('file', blob, 'transcript.png');

      // The neccesary steps needed here are:
      // 1. Upload the image to a server
      // 2. Get back a public URL
      // 3. Share that URL
      // For now, i'll just share the transcript as a text

      const url =
        platform === 'facebook'
          ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              window.location.href
            )}`
          : `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

      window.open(url, '_blank');
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const downloadAsPDF = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);
    const canvas = await generateImage();
    if (!canvas) return;

    try {
      const pdf = new jsPDF({
        format: 'a4',
        unit: 'px',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('transcript.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const downloadAsImage = async () => {
    setIsSharing(true);
    const canvas = await generateImage();
    if (!canvas) return;

    try {
      const link = document.createElement('a');
      link.download = 'transcript.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" disabled={isSharing}>
        <Share2
          size={16}
          strokeWidth={1.25}
          className={`cursor-pointer ${isSharing ? 'opacity-50' : ''}`}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => shareToSocial('facebook')}>
          Share to Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToSocial('twitter')}>
          Share to Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadAsPDF}>
          Download as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadAsImage}>
          Download as Image
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareTranscript;

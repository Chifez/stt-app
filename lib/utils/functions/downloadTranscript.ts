import jsPDF from 'jspdf';

interface TranscriptData {
  text: string;
  date: string;
}

export const downloadTranscript = (transcript: TranscriptData) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text('Transcript', 20, 20);

  // Add date
  doc.setFontSize(12);
  doc.text(`Date: ${new Date(transcript.date).toLocaleDateString()}`, 20, 30);

  // Add content with word wrap
  doc.setFontSize(12);
  const splitText = doc.splitTextToSize(transcript.text, 170); // 170 is the max width
  doc.text(splitText, 20, 40);

  // Save the PDF
  doc.save(`transcript-${new Date(transcript.date).toLocaleDateString()}.pdf`);
};

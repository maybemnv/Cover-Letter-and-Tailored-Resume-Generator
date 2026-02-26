interface CoverLetterResultProps {
  coverLetter: string;
}

export default function CoverLetterResult({ coverLetter }: CoverLetterResultProps) {
  return (
    <div className="font-serif text-[#f5f5f4] text-lg leading-[2.2] whitespace-pre-wrap p-8 md:p-12 rounded-[2rem] bg-[#12151a]/30 border border-[#1e2530] shadow-inner selection:bg-[#2a9d8f]/30">
      {coverLetter}
    </div>
  );
}

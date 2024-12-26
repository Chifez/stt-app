import {
  ChevronLeftIcon,
  Mic,
  NotepadText,
  Pause,
  Podcast,
  RotateCcw,
  Square,
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { AudioWave } from '../shared/AudioWave';

const Convert = () => {
  return (
    <div className="w-[60%] mx-auto space-y-8">
      <nav className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-1">
          <ChevronLeftIcon />
          Back
        </div>

        <div className="flex items-center gap-4">
          <span>
            <Mic />
          </span>
          <span>
            <Podcast />
          </span>
          <span>
            <NotepadText />
          </span>
        </div>
      </nav>

      <Card className="w-[80%] mx-auto p-2 bg-blue-500/80">
        <CardContent>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Necessitatibus, magni sint? Asperiores debitis velit quibusdam itaque
          libero veritatis cum error.
        </CardContent>
      </Card>

      <div className="flex items-center justify-center mx-auto">
        <AudioWave />
      </div>

      <div className="flex items-center justify-center gap-4">
        <Pause />
        <Square />
        <RotateCcw />
      </div>
    </div>
  );
};

export default Convert;

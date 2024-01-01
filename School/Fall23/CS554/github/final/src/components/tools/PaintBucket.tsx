import { BeakerIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@material-tailwind/react";

interface PaintBucketProps {
  onClick: () => void;
}

export default function PaintBucket({ onClick }: PaintBucketProps) {
  return (
    <div className="tool-primary">

        <IconButton variant="gradient" className="tool-button" onClick={onClick}>
          <BeakerIcon className="tool-icon" />
        </IconButton>

    </div>
  );
}

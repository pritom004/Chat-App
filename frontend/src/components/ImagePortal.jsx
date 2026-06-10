import { Cross, X } from "lucide-react";
import { createPortal } from "react-dom";

const ImagePortal = ({ image, onClose }) => {
  let portalRoot = document.getElementById("portal");

  if (!portalRoot) return null;



  return createPortal(
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
      <div className="size-[50%] relative">
        <img src={image} alt="Preview" />
        <button className="absolute -right-6 -top-6 cursor-pointer" onClick={onClose}>
            <X />
        </button>
      </div>
    </div>,
    portalRoot,
  );
};

export default ImagePortal;

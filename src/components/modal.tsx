import React from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface GlobalModalProps {
  title: string;
  description: string;
  children: React.ReactNode;
  buttonTriggerText: string;
  Icon?: React.ElementType;
  openHandler?: () => void;
}

const GlobalModal: React.FC<GlobalModalProps> = (props) => {
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open && props.openHandler) props.openHandler();
      }}
    >
      <DialogTrigger asChild>
        <Button type="button">
          <div className="flex flex-row items-center gap-4">
            <span>{props.buttonTriggerText}</span>
            {props.Icon && <props.Icon />}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.description}</DialogDescription>
        </DialogHeader>
        {props.children}
      </DialogContent>
    </Dialog>
  );
};

export default GlobalModal;

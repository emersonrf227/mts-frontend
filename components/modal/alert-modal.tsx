'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Você tem certeza?"
      description="Esta ação não pode ser desfeita."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex items-center justify-end w-full pt-6 space-x-2">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button loading={loading} variant="danger" className='text-white' onClick={onConfirm}>
          Confirmar
        </Button>
      </div>
    </Modal>
  );
};

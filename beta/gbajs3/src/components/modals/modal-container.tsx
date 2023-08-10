import { useContext } from 'react';
import Modal from 'react-modal';

import { ModalContext } from '../../context/modal/modal.tsx';

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  },
  content: {
    width: 'calc(100dvw - 20px)',
    height: 'fit-content',
    margin: '25px auto auto auto',
    backgroundColor: '#fff',
    inset: '10px',
    maxWidth: '500px',
    padding: '0',
    maxHeight: '90dvh',
    display: 'flex',
    flexDirection: 'column' as const,
  },
};

export const ModalContainer = () => {
  const { modalContent, isModalOpen, setIsModalOpen } =
    useContext(ModalContext);

  return (
    <Modal
      appElement={document.getElementById('root') || undefined}
      closeTimeoutMS={400}
      isOpen={isModalOpen}
      style={modalStyles}
      onRequestClose={() => setIsModalOpen(false)}
    >
      {modalContent}
    </Modal>
  );
};
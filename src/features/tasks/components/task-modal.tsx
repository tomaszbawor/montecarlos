"use client";

import Modal from "react-modal";
import type { Task } from "@/app/hooks/useTasks";
import { TaskForm } from "@/features/tasks/components/task-form";

Modal.setAppElement("body");

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "490px",
    marginRight: "-30%",
    transform: "translate(-50%, -50%)",
  },
};

interface TaskModalProps {
  isOpen: boolean;
  initialTask?: Task;
  taskIndex?: number;
  onSubmit: (task: Task, index?: number) => void;
  onClose: () => void;
}

export function TaskModal({
  isOpen,
  initialTask,
  taskIndex,
  onSubmit,
  onClose,
}: TaskModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      style={modalStyles}
      onRequestClose={onClose}
      contentLabel="Add/Edit Task"
    >
      <TaskForm
        mode={initialTask ? "edit" : "create"}
        initialTask={initialTask}
        taskIndex={taskIndex}
        onSubmit={onSubmit}
        onCancel={initialTask ? onClose : undefined}
      />
    </Modal>
  );
}

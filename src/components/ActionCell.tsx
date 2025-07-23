import { Box, Button } from "@mui/material";

interface ActionCellProps {
  onDelete: () => void;
  // Add more actions as needed
}

const ActionCell: React.FC<ActionCellProps> = ({ onDelete }) => {
  return (
    <Box padding={2} display="flex" alignItems="center">
      <Button
        type="button"
        variant="contained"
        color="error"
        className="px-2 py-1 m-1"
        onClick={onDelete}
      >
        Delete
      </Button>
      {/* Add more action buttons here */}
    </Box>
  );
};

export default ActionCell;

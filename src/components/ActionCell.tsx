import { Box, Button } from "@mui/material";

interface ActionCellProps {
  onDelete: () => void;
  onEdit?: () => void;
}

const ActionCell: React.FC<ActionCellProps> = ({ onDelete, onEdit }) => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Button
        type="button"
        variant="contained"
        color="error"
        size="small"
        onClick={onDelete}
        sx={{ minWidth: 80 }}
      >
        Delete
      </Button>
      {onEdit && (
        <Button
          type="button"
          variant="contained"
          color="primary"
          size="small"
          onClick={onEdit}
          sx={{ minWidth: 80 }}
        >
          Edit
        </Button>
      )}
    </Box>
  );
};

export default ActionCell;
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useReducer, useState } from "react";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Link } from "react-router-dom";
/**
 * interface for Task
 * @property {number} id
 * @property {string} text
 * @property {boolean} done
 * @property {string} priority
 * @property {boolean} isEdit
 */

interface Task {
  id: number;
  text: string;
  priority: string;
  isEdit: boolean;
}

/**
 * interface for Task
 * @property {string} type
 * @property {Task} task
 */
interface Action {
  type: string;
  task: Task;
}

// task state for reducer
type TaskState = Task[];

/**
 *
 * @returns
 */
const ToDoList = () => {
  /**
   * function reducer
   * @param state
   * @param action
   * @returns
   */
  function reducer(state: TaskState, action: Action) {
    switch (action.type) {
      case "add": {
        return [...state, action.task];
      }
      case "openEdit": {
        return state.map((t) => (t.id === action.task.id ? action.task : t));
      }
      case "save": {
        return state.map((t) => (t.id === action.task.id ? action.task : t));
      }
      case "remove": {
        return state.filter((t) => t.id !== action.task.id);
      }
      case "up": {
        const index = state.findIndex((task) => task.id === action.task.id);
        if (index > 0) {
          const newTasks = [...state];
          [newTasks[index - 1], newTasks[index]] = [
            newTasks[index],
            newTasks[index - 1],
          ];
          return newTasks;
        }
        return state;
      }
      case "down": {
        const index = state.findIndex((task) => task.id === action.task.id);
        if (index >= 0 && index < state.length - 1) {
          const newTasks = [...state];
          [newTasks[index], newTasks[index + 1]] = [
            newTasks[index + 1],
            newTasks[index],
          ];
          return newTasks;
        }
        return state;
      }
      default:
        return state;
    }
  }

  // initial value for useReducer
  const initialTasks: Task[] = [];

  const [tasks, dispatch] = useReducer(reducer, initialTasks);
  // state for new task
  const [newTaskText, setNewTaskText] = useState("");
  // state for edit task
  const [editTask, setEditTask] = useState<Task>({
    id: -1,
    text: "",
    priority: "#f8f8fa",
    isEdit: false,
  });
  // state for priorirty
  const [priority, setPriority] = useState("#f8f8fa");
  /**
   *
   * @param event
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriority((event.target as HTMLInputElement).value);
  };
  //
  const handleAddTask = () => {
    if (newTaskText.trim() === "") return;

    const newTask: Task = {
      id: tasks.length + 1,
      text: newTaskText.trim(),
      priority: priority,
      isEdit: false,
    };

    dispatch({
      type: "add",
      task: newTask,
    });

    setNewTaskText("");
  };

  //
  const handleChangeTask = (task: Task) => {
    setEditTask({
      id: task.id,
      text: task.text,
      priority: task.priority,
      isEdit: true,
    });
    dispatch({
      type: "openEdit",
      task: editTask,
    });
  };

  //
  const handeSaveTask = () => {
    dispatch({
      type: "save",
      task: editTask,
    });
    setEditTask({
      id: -1,
      text: "",
      priority: "#f8f8fa",
      isEdit: false,
    });
  };
  return (
    <Box
      sx={{ my: 3, display: "flex", height: "100%", justifyContent: "center" }}
    >
      <Link to="/">Back</Link>
      <List
        sx={{
          width: "100%",
          maxWidth: 700,
        }}
        subheader={
          <ListSubheader>
            <Typography variant="h6" marginY={5}>
              TO DO LIST
            </Typography>
          </ListSubheader>
        }
      >
        <Box display="flex">
          {/* input text field  */}
          <TextField
            onChange={(e: any) => setNewTaskText(e.target.value)}
            value={newTaskText}
          />
          {/* input radio for priority */}
          <FormControl sx={{ ml: 2 }}>
            <FormLabel>Priority</FormLabel>
            <RadioGroup row={true} value={priority} onChange={handleChange}>
              <FormControlLabel value="red" control={<Radio />} label="High" />
              <FormControlLabel
                value="#ccc"
                control={<Radio />}
                label="Normal"
              />
              <FormControlLabel
                value="#f8f8fa"
                control={<Radio />}
                label="Low"
              />
            </RadioGroup>
          </FormControl>
          {/* button add task */}
          <Button
            variant="contained"
            size="small"
            sx={{ ml: 2 }}
            onClick={handleAddTask}
          >
            Add Task
          </Button>
        </Box>
        {/* list tasks */}
        {tasks.map((task: Task) => {
          return (
            <ListItem
              key={task.id}
              sx={{
                pt: 2,
                width: "100%",
                bgcolor: task.priority,
                justifyContent: "space-between",
                mt: 2,
                maxWidth: 700,
                position: "relative",
              }}
            >
              <Box display="grid">
                <Button
                  onClick={() =>
                    dispatch({
                      type: "up",
                      task: task,
                    })
                  }
                >
                  <ArrowUpward />
                </Button>
                <Button
                  onClick={() =>
                    dispatch({
                      type: "down",
                      task: task,
                    })
                  }
                >
                  <ArrowDownward />
                </Button>
              </Box>
              {task.isEdit ? ( // task.isEdit: true => open textfield and save, false => edit button
                <Box display="flex">
                  <TextField
                    value={editTask.text}
                    onChange={(e: any) =>
                      setEditTask({
                        id: task.id,
                        text: e.target?.value,
                        priority: task.priority,
                        isEdit: false,
                      })
                    }
                  />
                  {/* button save after editing text */}
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handeSaveTask}
                    sx={{ position: "absolute", right: 150, top: 34 }}
                  >
                    Save
                  </Button>
                </Box>
              ) : (
                // button for edit => open text field
                <Box display="flex">
                  <ListItemText primary={task.text} />
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleChangeTask(task)}
                    sx={{ position: "absolute", right: 150, top: 34 }}
                  >
                    Edit
                  </Button>
                </Box>
              )}
              {/* button remove task */}
              <Button
                sx={{ ml: 2 }}
                variant="contained"
                color="error"
                onClick={() =>
                  dispatch({
                    type: "remove",
                    task: task,
                  })
                }
              >
                Remove
              </Button>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default ToDoList;

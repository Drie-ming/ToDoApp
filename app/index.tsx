import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"
import RemixIcon from "react-native-remix-icon"
import { Checkbox } from 'expo-checkbox';
import Stats from "@/components/Stats";
export default function Index() {

  const [task, setTask] = useState<string>("")
  const [storedTasks, setStoredTasks] = useState<Task[]>([]);

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

  const storeTasks = async(tasks: Task[]) => {
    await AsyncStorage.setItem("tasks", JSON.stringify(tasks))
  }

  const addTask = async() => { 
    const newId =
      storedTasks.length > 0 ? storedTasks[storedTasks.length - 1].id + 1 : 1;

    const newTask: Task = {
      id: newId,
      text: task,
      completed: false,
    };

    const newTaskList  = [...storedTasks, newTask];
    setStoredTasks(newTaskList)
    await storeTasks(newTaskList)
    setTask("")
  }

  const getTask = async() => {
    const newTask = await AsyncStorage.getItem("tasks");

   if (newTask) {
    try {
      const parsedTasks: Task[] = JSON.parse(newTask);
      setStoredTasks(parsedTasks);
    } catch (e) {
      setStoredTasks([]);
    }
  } else {
    setStoredTasks([]); 
  }
  }

  const toggleTask = async (id: number) => {
    const updated = storedTasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setStoredTasks(updated);
    await storeTasks(updated);
  };

  const deleteTask = async (id: number) => {
    const updated = storedTasks.filter((t) => t.id !== id);
    setStoredTasks(updated);
    await storeTasks(updated);
  };

   useEffect(() => {
    getTask();
  }, [])

  const completeAllTask = async () => {
     const updated = storedTasks.map((t) => ({...t, completed: true, }));
    setStoredTasks(updated);
};

const deleteCompletedTasks = async () => {
    const updated = storedTasks.filter((t) => !t.completed);
    setStoredTasks(updated);  
    await AsyncStorage.setItem("tasks", JSON.stringify(updated));
};

 const clearAll = async () => {
    await AsyncStorage.clear(); 
    setStoredTasks([]);         
};

const totalTasks = storedTasks.length;
const completedTasks = storedTasks.filter((t) => t.completed).length;
const pendingTasks = totalTasks - completedTasks;


  return (
    <View className="flex-1 items-center justify-start bg-[#F7F7F7]">
      <Header/>
      <View className="flex-row gap-2 w-full justify-evenly items-center m-5">
        <View>
          <TextInput
            className="border-2 border-solid border-black h-10 w-60 text-center rounded-md"
            placeholder="Enter Task Here"
            onChangeText={(text) => setTask(text)}
            value={task}
          />
        </View>

        <View>
          <Pressable className={`w-20 h-10 rounded-full shadow-md items-center justify-center 
          ${task.trim().length === 0 ? "bg-gray-400" : "bg-blue-500 active:opacity-80"}`}
          onPress={addTask}
          disabled={task.trim().length === 0}
          >
            <Text className="text-center text-white text-lg font-semibold">Add</Text>
          </Pressable>
        </View>
      </View>

       <View className="w-[90%] h-[50%] border border-black rounded-lg overflow-hidden bg-white shadow-md">
        <FlatList
        className="flex-1"
          data={storedTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="p-4 border-b border-gray-300 flex flex-row w-full justify-between items-center">
             
            <Checkbox
            className="w-6 h-6 justify-center items-center"
              value={item.completed}
              onValueChange={() => toggleTask(item.id)}
              color={item.completed ? "#10B981" : undefined}
            />
              
              <View className={`w-52 `}>
                <Text className={`text-lg text-center ${item.completed ? "line-through text-gray-500 opacity-60" : ""}`}>
                  {item.text }</Text>
              </View>

              <Pressable 
              className="w-10 h-10 items-center justify-center" 
              onPress={() => deleteTask(item.id)}
              >
                <RemixIcon name="delete-bin-7-line" size={32}/>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <View className="flex-1  items-center justify-center">
              <Text className="text-gray-500 text-xl font-semibold ">No tasks yet</Text>
            </View>
           }
        />
      </View>

      
          <View className="flex-row m-2 w-[90%] items-end justify-evenly gap-2">
          <View>
             <Pressable className="w-24 h-10 bg-[#34C759] rounded-full shadow-md  justify-center active:opacity-80"
             onPress={completeAllTask}
          >
            <Text className="text-center text-white text-xs font-semibold">All Completed</Text>
          </Pressable>
            </View>

            <View>
              <Pressable className="w-32 h-10 bg-red-800 rounded-full shadow-md  justify-center active:opacity-80"
            onPress={deleteCompletedTasks}
          >
            <Text className="text-center text-white text-xs font-semibold">Clear Completed Task</Text>
          </Pressable>
            </View>

            <View>
              <Pressable className="w-24 h-10 bg-[#FF3B30] rounded-full shadow-md  justify-center active:opacity-80"
            onPress={clearAll}
          >
            <Text className="text-center text-white text-xs font-semibold">Clear all</Text>
          </Pressable>
            </View>

        </View>

        <Stats pendingTasks={pendingTasks} completedTasks={completedTasks} totalTasks={totalTasks} />

    </View>
  );
}


import { View, Text } from 'react-native'
import React from 'react'


interface StatsProps {
       pendingTasks : number;
       completedTasks :number;
       totalTasks : number;
    }
 
const Stats = ({pendingTasks, completedTasks, totalTasks} : StatsProps ) => {
  return(
    <View className="flex-col border-2 border-solid h-32 w-[60%] rounded-md justify-evenly items-center ">
          <View className="border border-solid w-[90%] rounded-sm">
            <Text className="font-normal text-xl text-center">Ongoing Task: {pendingTasks}</Text>
          </View>
          <View className="border border-solid w-[90%] rounded-sm">
            <Text className="font-normal text-xl text-center">Task Completed: {completedTasks}</Text>
          </View>
         <View className="border border-solid w-[90%] rounded-sm">
            <Text className="font-normal text-xl text-center">Total Task Count: {totalTasks}</Text>
          </View>
</View>
  )
}

export default Stats
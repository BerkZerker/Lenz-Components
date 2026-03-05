import React from 'react';
import { View, Text } from 'react-native';
import GlassCard from '../foundation/GlassCard';
import RadialProgress from './RadialProgress';
import { getHabitColor } from '../../config/theme';

export default function RadialProgressShowcase({ theme, habits, style = {} }) {
  const completed = habits.filter(h => h.completed).length;

  return (
    <GlassCard theme={theme} style={style}>
      <View style={{ padding: 20 }}>
        <Text style={{
          fontSize: 14,
          fontFamily: 'Inter_500Medium',
          color: theme.textPrimary,
          marginBottom: 12,
        }}>
          Radial Progress
        </Text>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <RadialProgress
            theme={theme}
            value={completed}
            total={habits.length}
            size={110}
            label="Today"
            sublabel={`${completed}/${habits.length}`}
          />
          <RadialProgress
            theme={theme}
            value={5}
            total={7}
            size={90}
            color={getHabitColor('sky').primary}
            label="This Week"
            sublabel="5/7 days"
            strokeWidth={7}
          />
          <RadialProgress
            theme={theme}
            value={23}
            total={30}
            size={90}
            color={getHabitColor('coral').primary}
            label="This Month"
            sublabel="23/30 days"
            strokeWidth={7}
          />
        </View>
      </View>
    </GlassCard>
  );
}

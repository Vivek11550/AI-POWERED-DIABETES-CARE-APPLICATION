import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; 
import Animated, { FadeInRight, FadeIn } from "react-native-reanimated";
import { diabetesQuiz } from "@/src/constants/diabetesQuiz";
import API from "@/src/services/api";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function QuizScreen() {
  const router = useRouter();
  const { token } = useAuth();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const question = diabetesQuiz[current];
  const progress = ((current + 1) / diabetesQuiz.length) * 100;

  const selectAnswer = (option: string) => {
    setSelected(option);
    setAnswers((prev) => ({
      ...prev,
      [question.id]: option,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    diabetesQuiz.forEach((q) => {
      if (answers[q.id] === q.answer) {
        score++;
      }
    });
    return score;
  };

  const submitQuiz = async () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResult(true);

    try {
      await API.post(
        "/quiz/submit",
        {
          score: finalScore,
          totalQuestions: diabetesQuiz.length,
          type: "initial",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTimeout(() => {
        router.replace("/dashboard/patient");
      }, 3000);
    } catch (err) {
      alert("Error submitting quiz");
    }
  };

  const nextQuestion = () => {
    if (!selected) return;
    if (current < diabetesQuiz.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      submitQuiz();
    }
  };

  /* ================= RESULT SCREEN ================= */

  if (showResult) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <Animated.View entering={FadeIn} style={styles.resultContainer}>
          <View style={styles.resultCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="trophy" size={50} color="#10B981" />
            </View>
            <Text style={styles.resultTitle}>Quiz Completed!</Text>
            <Text style={styles.resultScoreLabel}>Accuracy Score</Text>
            <Text style={styles.resultScoreValue}>
              {score} <Text style={{fontSize: 20, color: '#94A3B8'}}>/ {diabetesQuiz.length}</Text>
            </Text>
            <View style={styles.loadingFooter}>
              <Text style={styles.resultMessage}>Syncing results to your profile...</Text>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  /* ================= QUIZ SCREEN ================= */

  return (
    // FIX 1: Remove 'top' from edges. The Stack header handles the notch.
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Stack.Screen 
        options={{ 
          title: "Health Quiz", 
          headerShown: true, 
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F8FAFC' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 5 }}>
              <Ionicons name="chevron-back" size={28} color="#0F172A" />
            </TouchableOpacity>
          )
        }} 
      />

      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.counter}>
          QUESTION <Text style={{color: '#0F172A'}}>{current + 1}</Text> OF {diabetesQuiz.length}
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      <Animated.View
        key={current}
        entering={FadeInRight.duration(400)}
        style={styles.quizArea}
      >
        <Text style={styles.questionText}>{question.question}</Text>

        <View style={styles.optionsList}>
          {question.options.map((option) => (
            <TouchableOpacity
              key={option}
              activeOpacity={0.8}
              style={[
                styles.optionBtn,
                selected === option && styles.selectedOptionBtn,
              ]}
              onPress={() => selectAnswer(option)}
            >
              <Text style={[
                styles.optionText,
                selected === option && styles.selectedOptionText,
              ]}>
                {option}
              </Text>
              {selected === option && (
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !selected && styles.disabledBtn]}
          onPress={nextQuestion}
          disabled={!selected}
        >
          <Text style={styles.nextButtonText}>
            {current === diabetesQuiz.length - 1 ? "Submit Assessment" : "Next Question"}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" style={{marginLeft: 8}} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // FIX 2: Removed marginTop: 35. Native header manages this space now.
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { padding: 24, paddingBottom: 10 },
  counter: { fontSize: 12, fontWeight: "800", color: "#94A3B8", letterSpacing: 1, marginBottom: 12 },
  progressTrack: { height: 8, backgroundColor: "#E2E8F0", borderRadius: 4, overflow: "hidden" },
  progressBar: { height: "100%", backgroundColor: "#10B981" },
  
  quizArea: { flex: 1, padding: 24, justifyContent: 'center' },
  questionText: { fontSize: 24, fontWeight: "800", color: "#0F172A", marginBottom: 32, lineHeight: 32 },
  
  optionsList: { gap: 12 },
  optionBtn: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: "#F1F5F9",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 5,
  },
  selectedOptionBtn: { borderColor: "#10B981", backgroundColor: "#F0FDF4" },
  optionText: { fontSize: 16, color: "#475569", fontWeight: "600", flex: 1 },
  selectedOptionText: { color: "#166534" },
  footer: { padding: 24, paddingBottom: 30 },
  nextButton: {
    backgroundColor: "#10B981",
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  disabledBtn: { backgroundColor: "#94A3B8", shadowOpacity: 0 },
  nextButtonText: { color: "white", fontSize: 18, fontWeight: "700" },

  resultContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  resultCard: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 30,
    padding: 40,
    alignItems: 'center',
    elevation: 10,
    shadowColor: "#0F172A",
    shadowOpacity: 0.1,
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  resultTitle: { fontSize: 28, fontWeight: "800", color: "#0F172A", marginBottom: 8 },
  resultScoreLabel: { fontSize: 14, fontWeight: "700", color: "#94A3B8", textTransform: 'uppercase' },
  resultScoreValue: { fontSize: 60, fontWeight: "900", color: "#10B981", marginVertical: 10 },
  loadingFooter: { marginTop: 20, alignItems: 'center' },
  resultMessage: { fontSize: 14, color: "#64748B", fontWeight: "500" },
});
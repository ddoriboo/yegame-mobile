import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { issuesAPI, betsAPI } from '../services/api';
import { getCategoryColor, formatDate, formatNumber } from '../utils/constants';

export default function IssueDetailScreen({ route, navigation }) {
  const { issueId } = route.params;
  const { user, updateUser } = useAuth();
  const [issue, setIssue] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [betting, setBetting] = useState(false);

  useEffect(() => {
    loadIssue();
  }, [issueId]);

  const loadIssue = async () => {
    try {
      const response = await issuesAPI.getIssue(issueId);
      if (response.success) {
        setIssue(response.issue);
      }
    } catch (error) {
      Alert.alert('오류', '이슈를 불러오는데 실패했습니다.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBet = async () => {
    if (!selectedChoice) {
      Alert.alert('알림', '예측을 선택해주세요.');
      return;
    }

    const amount = parseInt(betAmount);
    if (!amount || amount <= 0) {
      Alert.alert('알림', '베팅 금액을 입력해주세요.');
      return;
    }

    if (amount > user.coins) {
      Alert.alert('알림', '코인이 부족합니다.');
      return;
    }

    setBetting(true);
    try {
      await betsAPI.placeBet(user.id, issueId, selectedChoice, amount);

      // 사용자 코인 업데이트
      const updatedUser = { ...user, coins: user.coins - amount };
      updateUser(updatedUser);

      Alert.alert('성공', '베팅이 완료되었습니다!', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert(
        '오류',
        error.response?.data?.error || '베팅에 실패했습니다.'
      );
    } finally {
      setBetting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!issue) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(issue.category) },
          ]}
        >
          <Text style={styles.categoryText}>{issue.category}</Text>
        </View>
        <Text style={styles.timeText}>{formatDate(issue.end_date)}</Text>
      </View>

      <Text style={styles.title}>{issue.title}</Text>

      {/* Current Probability */}
      <View style={styles.probabilitySection}>
        <Text style={styles.sectionTitle}>현재 확률</Text>
        <View style={styles.probabilityBar}>
          <View
            style={[
              styles.probabilityFill,
              { width: `${issue.yes_price}%` },
            ]}
          />
        </View>
        <View style={styles.probabilityLabels}>
          <View style={styles.probabilityItem}>
            <Text style={styles.probabilityLabel}>Yes</Text>
            <Text style={styles.probabilityValue}>{issue.yes_price}%</Text>
          </View>
          <View style={styles.probabilityItem}>
            <Text style={styles.probabilityLabel}>No</Text>
            <Text style={styles.probabilityValue}>{100 - issue.yes_price}%</Text>
          </View>
        </View>
      </View>

      {/* Betting Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>총 베팅</Text>
          <Text style={styles.statValue}>
            {formatNumber(issue.total_volume || 0)} 감
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Yes 베팅</Text>
          <Text style={styles.statValue}>
            {formatNumber(issue.yes_volume || 0)} 감
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>No 베팅</Text>
          <Text style={styles.statValue}>
            {formatNumber(issue.no_volume || 0)} 감
          </Text>
        </View>
      </View>

      {/* Place Bet */}
      {user && (
        <View style={styles.betSection}>
          <Text style={styles.sectionTitle}>예측하기</Text>

          <View style={styles.choiceButtons}>
            <TouchableOpacity
              style={[
                styles.choiceButton,
                styles.choiceButtonYes,
                selectedChoice === 'Yes' && styles.choiceButtonSelected,
              ]}
              onPress={() => setSelectedChoice('Yes')}
            >
              <Text
                style={[
                  styles.choiceButtonText,
                  selectedChoice === 'Yes' && styles.choiceButtonTextSelected,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.choiceButton,
                styles.choiceButtonNo,
                selectedChoice === 'No' && styles.choiceButtonSelected,
              ]}
              onPress={() => setSelectedChoice('No')}
            >
              <Text
                style={[
                  styles.choiceButtonText,
                  selectedChoice === 'No' && styles.choiceButtonTextSelected,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.amountInput}
            placeholder="베팅 금액 (감)"
            value={betAmount}
            onChangeText={setBetAmount}
            keyboardType="numeric"
          />

          <View style={styles.quickAmounts}>
            {[1000, 5000, 10000].map(amount => (
              <TouchableOpacity
                key={amount}
                style={styles.quickAmountButton}
                onPress={() => setBetAmount(amount.toString())}
              >
                <Text style={styles.quickAmountText}>
                  {formatNumber(amount)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.walletInfo}>
            <Text style={styles.walletLabel}>보유 감:</Text>
            <Text style={styles.walletAmount}>
              {formatNumber(user.coins)}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.betButton, betting && styles.betButtonDisabled]}
            onPress={handlePlaceBet}
            disabled={betting}
          >
            <Text style={styles.betButtonText}>
              {betting ? '베팅 중...' : '베팅하기'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#fff',
    color: '#111827',
    lineHeight: 28,
  },
  probabilitySection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  probabilityBar: {
    height: 32,
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  probabilityFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  probabilityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  probabilityItem: {
    alignItems: 'center',
  },
  probabilityLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  probabilityValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  betSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  choiceButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  choiceButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  choiceButtonYes: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  choiceButtonNo: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  choiceButtonSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  choiceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  choiceButtonTextSelected: {
    color: '#fff',
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  quickAmountButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  walletInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
  },
  walletLabel: {
    fontSize: 14,
    color: '#92400E',
  },
  walletAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  betButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  betButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  betButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

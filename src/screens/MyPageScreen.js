import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { betsAPI } from '../services/api';
import { getCategoryColor, formatNumber } from '../utils/constants';

export default function MyPageScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [bets, setBets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBets();
    }
  }, [user]);

  const loadBets = async () => {
    try {
      const data = await betsAPI.getUserBets(user.id);
      setBets(data);
    } catch (error) {
      console.error('Failed to load bets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBets();
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>로그인이 필요합니다.</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>로그인하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.username.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.coinsContainer}>
          <Text style={styles.coinsLabel}>보유 감</Text>
          <Text style={styles.coinsAmount}>{formatNumber(user.coins)}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      {/* Betting History */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>
          베팅 내역 ({bets.length})
        </Text>

        {loading ? (
          <Text style={styles.loadingText}>로딩 중...</Text>
        ) : bets.length === 0 ? (
          <View style={styles.emptyBets}>
            <Text style={styles.emptyBetsText}>
              아직 베팅 내역이 없습니다.
            </Text>
            <TouchableOpacity
              style={styles.exploreButto}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.exploreButtonText}>
                예측하러 가기
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          bets.map(bet => (
            <View key={bet.id} style={styles.betCard}>
              <View style={styles.betHeader}>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: getCategoryColor(bet.category) },
                  ]}
                >
                  <Text style={styles.categoryText}>{bet.category}</Text>
                </View>
                <View
                  style={[
                    styles.choiceBadge,
                    bet.choice === 'Yes' ? styles.choiceBadgeYes : styles.choiceBadgeNo,
                  ]}
                >
                  <Text style={styles.choiceText}>{bet.choice}</Text>
                </View>
              </View>

              <Text style={styles.betTitle} numberOfLines={2}>
                {bet.title}
              </Text>

              <View style={styles.betFooter}>
                <View style={styles.betAmount}>
                  <Text style={styles.betAmountLabel}>베팅 금액</Text>
                  <Text style={styles.betAmountValue}>
                    {formatNumber(bet.amount)} 감
                  </Text>
                </View>
                <View style={styles.betStatus}>
                  <Text
                    style={[
                      styles.statusText,
                      bet.status === 'active' ? styles.statusActive : styles.statusEnded,
                    ]}
                  >
                    {bet.status === 'active' ? '진행 중' : '종료'}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  userInfo: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 20,
  },
  coinsLabel: {
    fontSize: 14,
    color: '#92400E',
    marginRight: 8,
  },
  coinsAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400E',
  },
  logoutButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  historySection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
  },
  emptyBets: {
    alignItems: 'center',
    padding: 40,
  },
  emptyBetsText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  exploreButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  betCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  choiceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  choiceBadgeYes: {
    backgroundColor: '#D1FAE5',
  },
  choiceBadgeNo: {
    backgroundColor: '#FEE2E2',
  },
  choiceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  betTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    lineHeight: 20,
  },
  betFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  betAmount: {},
  betAmountLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  betAmountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  betStatus: {},
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusActive: {
    color: '#10B981',
  },
  statusEnded: {
    color: '#6B7280',
  },
});

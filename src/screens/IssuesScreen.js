import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { issuesAPI } from '../services/api';
import { CATEGORIES, getCategoryColor, formatDate, formatNumber } from '../utils/constants';

export default function IssuesScreen({ navigation }) {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [selectedCategory, searchQuery, issues]);

  const loadIssues = async () => {
    try {
      const response = await issuesAPI.getAllIssues();
      if (response.success) {
        setIssues(response.issues);
      }
    } catch (error) {
      console.error('Failed to load issues:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterIssues = () => {
    let filtered = issues;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(issue => issue.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredIssues(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadIssues();
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="이슈 검색..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && {
                backgroundColor: category.color,
              },
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Issues List */}
      <ScrollView
        style={styles.issuesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            전체 이슈 ({filteredIssues.length})
          </Text>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>로딩 중...</Text>
        ) : filteredIssues.length === 0 ? (
          <Text style={styles.emptyText}>
            {searchQuery
              ? '검색 결과가 없습니다.'
              : '예측 이슈가 없습니다.'}
          </Text>
        ) : (
          filteredIssues.map(issue => (
            <TouchableOpacity
              key={issue.id}
              style={styles.issueCard}
              onPress={() => navigation.navigate('IssueDetail', { issueId: issue.id })}
            >
              <View style={styles.issueHeader}>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: getCategoryColor(issue.category) },
                  ]}
                >
                  <Text style={styles.categoryBadgeText}>{issue.category}</Text>
                </View>
                <Text style={styles.issueTime}>{formatDate(issue.end_date)}</Text>
              </View>

              <Text style={styles.issueTitle} numberOfLines={2}>
                {issue.title}
              </Text>

              {/* Probability Bar */}
              <View style={styles.probabilityContainer}>
                <View style={styles.probabilityBar}>
                  <View
                    style={[
                      styles.probabilityFill,
                      { width: `${issue.yes_price}%` },
                    ]}
                  />
                </View>
                <View style={styles.probabilityLabels}>
                  <Text style={styles.probabilityYes}>Yes {issue.yes_price}%</Text>
                  <Text style={styles.probabilityNo}>No {100 - issue.yes_price}%</Text>
                </View>
              </View>

              <View style={styles.issueFooter}>
                <Text style={styles.volumeText}>
                  총 베팅: {formatNumber(issue.total_volume || 0)} 감
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  categoryScroll: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryContent: {
    padding: 12,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  issuesList: {
    flex: 1,
    padding: 16,
  },
  listHeader: {
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 40,
  },
  issueCard: {
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
  issueHeader: {
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
  categoryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  issueTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    lineHeight: 22,
  },
  probabilityContainer: {
    marginBottom: 12,
  },
  probabilityBar: {
    height: 24,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    overflow: 'hidden',
  },
  probabilityFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 12,
  },
  probabilityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  probabilityYes: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  probabilityNo: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  issueFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  volumeText: {
    fontSize: 12,
    color: '#6B7280',
  },
});

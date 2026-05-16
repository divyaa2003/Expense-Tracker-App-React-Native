import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";

import { PieChart } from "react-native-chart-kit";

import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  // STATES
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const [expenses, setExpenses] =
    useState([]);

  const [darkMode, setDarkMode] =
    useState(true);

  // BUDGET
  const [budget, setBudget] =
    useState("5000");

  // EDIT
  const [editingId, setEditingId] =
    useState(null);

  // FILTER
  const [filter, setFilter] =
    useState("All");

  // CATEGORY
  const [category, setCategory] =
    useState("Food");

  const categories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Other",
  ];

  // ADD / UPDATE EXPENSE
  const addExpense = () => {
    if (!title || !amount) return;

    if (editingId) {
      setExpenses(
        expenses.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title,
                amount,
                category,
              }
            : item
        )
      );

      setEditingId(null);
    } else {
      const newExpense = {
        id: Date.now().toString(),
        title,
        amount,
        category,
        date: new Date(),
      };

      setExpenses([
        newExpense,
        ...expenses,
      ]);
    }

    setTitle("");
    setAmount("");
  };

  // DELETE
  const deleteExpense = (id) => {
    setExpenses(
      expenses.filter(
        (item) => item.id !== id
      )
    );
  };

  // EDIT
  const editExpense = (item) => {
    setTitle(item.title);

    setAmount(item.amount);

    setCategory(item.category);

    setEditingId(item.id);
  };

  // CLEAR ALL
  const clearAllExpenses = () => {
    setExpenses([]);
  };

  // TOTAL
  const total = expenses.reduce(
    (sum, item) =>
      sum + Number(item.amount),
    0
  );

  // FILTER LOGIC
  const filteredExpenses =
    expenses.filter((item) => {
      if (filter === "All")
        return true;

      return (
        item.category === filter
      );
    });

  // CATEGORY TOTALS
  const foodTotal = expenses
    .filter(
      (item) => item.category === "Food"
    )
    .reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

  const travelTotal = expenses
    .filter(
      (item) =>
        item.category === "Travel"
    )
    .reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

  // PIE CHART DATA
  const pieData = [
    {
      name: "Food",
      amount: foodTotal,
      color: "#ff6b6b",
      legendFontColor:
        darkMode ? "white" : "black",
      legendFontSize: 14,
    },

    {
      name: "Travel",
      amount: travelTotal,
      color: "#4ecdc4",
      legendFontColor:
        darkMode ? "white" : "black",
      legendFontSize: 14,
    },
  ];

  // THEME
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // ANIMATED CARD
  const ExpenseCard = ({ item }) => {
    const scale =
      React.useRef(
        new Animated.Value(1)
      ).current;

    const animateIn = () => {
      Animated.spring(scale, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();
    };

    const animateOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={animateIn}
        onPressOut={animateOut}
      >
        <Animated.View
          style={[
            styles.expenseCard,
            {
              backgroundColor:
                darkMode
                  ? "rgba(255,255,255,0.08)"
                  : "#ffffff",

              transform: [
                { scale },
              ],
            },
          ]}
        >
          <View>
            <Text
              style={[
                styles.expenseTitle,
                {
                  color: darkMode
                    ? "white"
                    : "black",
                },
              ]}
            >
              {item.title}
            </Text>

            <Text
              style={
                styles.categoryText
              }
            >
              {item.category}
            </Text>
          </View>

          <View
            style={{
              alignItems: "flex-end",
            }}
          >
            <Text
              style={
                styles.amountText
              }
            >
              ₹ {item.amount}
            </Text>

            <TouchableOpacity
              onPress={() =>
                deleteExpense(
                  item.id
                )
              }
            >
              <Text
                style={
                  styles.deleteText
                }
              >
                Delete
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                editExpense(item)
              }
            >
              <Text style={styles.editText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={
        false
      }
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      <LinearGradient
        colors={
          darkMode
            ? [
                "#0f0c29",
                "#302b63",
                "#24243e",
              ]
            : [
                "#dfe9f3",
                "#ffffff",
                "#d6e4f0",
              ]
        }
        start={{
          x: 0,
          y: 0,
        }}
        end={{
          x: 1,
          y: 1,
        }}
        style={styles.container}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text
            style={[
              styles.heading,
              {
                color: darkMode
                  ? "white"
                  : "black",
              },
            ]}
          >
            Expense Tracker
          </Text>

          <TouchableOpacity
            style={
              styles.themeButton
            }
            onPress={toggleTheme}
          >
            <Text
              style={
                styles.themeText
              }
            >
              {darkMode
                ? "☀️"
                : "🌙"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* BUDGET INPUT */}
        <TextInput
          placeholder="Set Monthly Budget"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
          style={[
            styles.input,
            {
              backgroundColor:
                darkMode
                  ? "rgba(255,255,255,0.08)"
                  : "#ffffff",

              color: darkMode
                ? "white"
                : "black",
            },
          ]}
        />

        {/* TOTAL */}
        <View
          style={[
            styles.totalCard,
            {
              backgroundColor:
                darkMode
                  ? "rgba(255,255,255,0.08)"
                  : "#ffffff",
            },
          ]}
        >
          <Text
            style={
              styles.totalLabel
            }
          >
            Monthly Total
          </Text>

          <Text
            style={
              styles.totalAmount
            }
          >
            ₹ {total}
          </Text>
        </View>

        {/* BUDGET CARD */}
        <View
          style={[
            styles.budgetCard,
            {
              backgroundColor:
                total >
                Number(budget)
                  ? "#ff595e"
                  : "rgba(255,255,255,0.08)",
            },
          ]}
        >
          <Text
            style={
              styles.budgetText
            }
          >
            Budget: ₹ {budget}
          </Text>

          <Text
            style={
              styles.budgetText
            }
          >
            Remaining: ₹
            {Number(budget) -
              total}
          </Text>
        </View>

        {/* PROGRESS BAR */}
        <View
          style={styles.progressBar}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  Math.min(
                    (total /
                      Number(
                        budget || 1
                      )) *
                      100,
                    100
                  )
                }%`,
              },
            ]}
          />
        </View>

        {/* INPUTS */}
        <TextInput
          placeholder="Expense Title"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
          style={[
            styles.input,
            {
              backgroundColor:
                darkMode
                  ? "rgba(255,255,255,0.08)"
                  : "#ffffff",

              color: darkMode
                ? "white"
                : "black",
            },
          ]}
        />

        <TextInput
          placeholder="Amount"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={[
            styles.input,
            {
              backgroundColor:
                darkMode
                  ? "rgba(255,255,255,0.08)"
                  : "#ffffff",

              color: darkMode
                ? "white"
                : "black",
            },
          ]}
        />

        {/* CATEGORY */}
        <View
          style={styles.categoryRow}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                {
                  backgroundColor:
                    category === cat
                      ? "#7209b7"
                      : "#444",
                },
              ]}
              onPress={() =>
                setCategory(cat)
              }
            >
              <Text
                style={
                  styles.categoryButtonText
                }
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ADD BUTTON */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={addExpense}
        >
          <Text
            style={
              styles.addButtonText
            }
          >
            {editingId
              ? "Update Expense"
              : "Add Expense"}
          </Text>
        </TouchableOpacity>

        {/* FILTERS */}
        <View style={styles.filterRow}>
          {[
            "All",
            "Food",
            "Travel",
          ].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.filterButton,
                {
                  backgroundColor:
                    filter === item
                      ? "#7209b7"
                      : "#444",
                },
              ]}
              onPress={() =>
                setFilter(item)
              }
            >
              <Text
                style={
                  styles.filterText
                }
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ANALYTICS */}
        <View
          style={styles.analyticsCard}
        >
          <Text
            style={
              styles.analyticsText
            }
          >
            🍔 Food: ₹
            {foodTotal}
          </Text>

          <Text
            style={
              styles.analyticsText
            }
          >
            ✈️ Travel: ₹
            {travelTotal}
          </Text>

          <Text
            style={
              styles.analyticsText
            }
          >
            📦 Total Expenses:
            {expenses.length}
          </Text>
        </View>

        {/* PIE CHART */}
        <View
          style={styles.chartContainer}
        >
          <Text
            style={styles.chartTitle}
          >
            Expense Analytics
          </Text>

          <PieChart
            data={pieData}
            width={
              Dimensions.get("window")
                .width - 40
            }
            height={220}
            chartConfig={{
              color: () => `white`,
            }}
            accessor={"amount"}
            backgroundColor={
              "transparent"
            }
            paddingLeft={"15"}
            absolute
          />
        </View>

        {/* CLEAR ALL */}
        <TouchableOpacity
          style={
            styles.clearAllButton
          }
          onPress={
            clearAllExpenses
          }
        >
          <Text
            style={
              styles.clearAllText
            }
          >
            Clear All Expenses
          </Text>
        </TouchableOpacity>

        {/* EXPENSE LIST */}
        <FlatList
          data={filteredExpenses}
          scrollEnabled={false}
          keyExtractor={(item) =>
            item.id
          }
          ListEmptyComponent={
            <Text
              style={
                styles.emptyText
              }
            >
              No expenses added
            </Text>
          }
          renderItem={({ item }) => (
            <ExpenseCard item={item} />
          )}
        />
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 80,
  },

  header: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  heading: {
    fontSize: 30,
    fontWeight: "bold",
  },

  themeButton: {
    backgroundColor: "#06d6a0",
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  themeText: {
    fontSize: 24,
  },

  totalCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.1)",

    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.15,
    shadowRadius: 10,

    elevation: 8,
  },

  totalLabel: {
    color: "#ccc",
    fontSize: 18,
  },

  totalAmount: {
    color: "#06d6a0",
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 10,
  },

  budgetCard: {
    padding: 18,
    borderRadius: 20,
    marginBottom: 10,

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.1)",

    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.15,
    shadowRadius: 10,

    elevation: 8,
  },

  budgetText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  progressBar: {
    height: 12,
    backgroundColor: "#333",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#06d6a0",
  },

  input: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    fontSize: 18,

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.15)",
  },

  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },

  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },

  categoryButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  addButton: {
    backgroundColor: "#7209b7",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 20,
  },

  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  filterRow: {
    flexDirection: "row",
    marginBottom: 20,
  },

  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    marginRight: 10,
  },

  filterText: {
    color: "white",
    fontWeight: "bold",
  },

  analyticsCard: {
    backgroundColor:
      "rgba(255,255,255,0.08)",

    padding: 18,
    borderRadius: 20,
    marginBottom: 20,

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.1)",

    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.15,
    shadowRadius: 10,

    elevation: 8,
  },

  analyticsText: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },

  chartContainer: {
    backgroundColor:
      "rgba(255,255,255,0.08)",

    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    alignItems: "center",

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.1)",
  },

  chartTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  clearAllButton: {
    backgroundColor: "#ff595e",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },

  clearAllText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  expenseCard: {
    flexDirection: "row",
    justifyContent:
      "space-between",

    padding: 18,
    borderRadius: 20,
    marginBottom: 15,

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.1)",

    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.15,
    shadowRadius: 10,

    elevation: 8,
  },

  expenseTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  categoryText: {
    color: "#ccc",
    marginTop: 5,
  },

  amountText: {
    color: "#06d6a0",
    fontSize: 22,
    fontWeight: "bold",
  },

  deleteText: {
    color: "#ff595e",
    marginTop: 10,
  },

  editText: {
    color: "#4ecdc4",
    marginTop: 10,
    fontWeight: "bold",
  },

  emptyText: {
    color: "#ccc",
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
  },
});
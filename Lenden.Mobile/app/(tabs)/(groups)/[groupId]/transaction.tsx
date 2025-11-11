import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { axiosInstance } from "@/src/services";
import { GroupEntity } from "@/src/types/groups/Interfaces";
import { Colors } from "@/src/theme/colors";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface User {
  id: number;
  fullName: string;
}

interface PaidBy {
  userId: number;
  amount: string;
}

interface SplitBetween {
  userId: number;
  amount: string;
}

export default function Transaction() {
  const { groupId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<User[]>([]);
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paidBy, setPaidBy] = useState<PaidBy[]>([]);
  const [splitBetween, setSplitBetween] = useState<SplitBetween[]>([]);
  const [splitType, setSplitType] = useState<"equally" | "unequally">(
    "equally"
  );
  const [group, setGroup] = useState<GroupEntity | null>(null);
  const currentUserId = useSelector((state: RootState) => state.auth.userId);

  // Modal states
  const [showPayerModal, setShowPayerModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showSplitTypeModal, setShowSplitTypeModal] = useState(false);
  const [selectedPayers, setSelectedPayers] = useState<number[]>([]);
  const [selectedSplitters, setSelectedSplitters] = useState<number[]>([]);

  useEffect(() => {
    if (!groupId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const groupResponse = await axiosInstance.get("/GroupApi");
        const foundGroup = groupResponse.data.find(
          (g: GroupEntity) => g.id == Number(groupId)
        );
        setGroup(foundGroup || null);

        const membersResponse = await axiosInstance.get(
          `/GroupApi/${groupId}/members`
        );
        setMembers(membersResponse.data);

        if (membersResponse.data.length > 0) {
          const firstMemberId = membersResponse.data[0].id;
          setPaidBy([{ userId: firstMemberId, amount: "" }]);
          setSelectedPayers([firstMemberId]);

          const allMemberIds = membersResponse.data.map((m) => m.id);
          setSelectedSplitters(allMemberIds);
          setSplitBetween(
            membersResponse.data.map((m) => ({ userId: m.id, amount: "" }))
          );
        }
      } catch (error: any) {
        console.error("Fetch error:", error.response?.status, error.message);
        Alert.alert("Error", "Failed to load group data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  useEffect(() => {
    if (!totalAmount || selectedSplitters.length === 0) return;

    const selectedMembers = members.filter((m) =>
      selectedSplitters.includes(m.id)
    );

    if (splitType === "equally") {
      const perMember = Number(totalAmount) / selectedMembers.length;
      setSplitBetween(
        selectedMembers.map((m) => ({
          userId: m.id,
          amount: perMember.toFixed(2),
        }))
      );
    } else {
      const perMember = Number(totalAmount) / selectedMembers.length;
      setSplitBetween((prev) => {
        const newSplit = selectedMembers.map((m) => {
          const existing = prev.find((p) => p.userId === m.id);
          return {
            userId: m.id,
            amount: existing?.amount || perMember.toFixed(2),
          };
        });
        return newSplit;
      });
    }

    if (selectedPayers.length > 0) {
      const equalAmount = (Number(totalAmount) / selectedPayers.length).toFixed(
        2
      );
      setPaidBy(
        selectedPayers.map((id) => ({ userId: id, amount: equalAmount }))
      );
    }
  }, [splitType, totalAmount, selectedSplitters, members, selectedPayers]);

  const handlePayerSelection = () => {
    if (selectedPayers.length === 0) {
      Alert.alert("Error", "Please select at least one payer.");
      return;
    }

    if (!totalAmount || Number(totalAmount) === 0) {
      setPaidBy(selectedPayers.map((id) => ({ userId: id, amount: "" })));
    } else {
      const equalAmount = (Number(totalAmount) / selectedPayers.length).toFixed(
        2
      );
      setPaidBy(
        selectedPayers.map((id) => ({ userId: id, amount: equalAmount }))
      );
    }
    setShowPayerModal(false);
  };

  const handleSplitSelection = () => {
    if (selectedSplitters.length === 0) {
      Alert.alert("Error", "Please select at least one person to split with.");
      return;
    }
    setShowSplitModal(false);
  };

  const togglePayerSelection = (userId: number) => {
    setSelectedPayers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSplitterSelection = (userId: number) => {
    setSelectedSplitters((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSplitChange = (userId: number, value: string) => {
    const updated = splitBetween.map((s) =>
      s.userId === userId ? { ...s, amount: value } : s
    );

    const sum = updated.reduce((acc, s) => acc + Number(s.amount || 0), 0);
    if (sum > Number(totalAmount)) {
      Alert.alert("Error", "Total split amount cannot exceed total expense.");
      return;
    }

    setSplitBetween(updated);
  };

  const getPayerText = () => {
    if (selectedPayers.length === 0) return "Select";
    if (selectedPayers.length === 1) {
      const payer = members.find((m) => m.id === selectedPayers[0]);
      return payer?.fullName || "Select";
    }
    return `${selectedPayers.length} people`;
  };

  const getSplitText = () => {
    if (selectedSplitters.length === members.length) return "all";
    if (selectedSplitters.length === 0) return "Select";
    return `${selectedSplitters.length} people`;
  };

  const handleAddTransaction = async () => {
    if (!totalAmount || paidBy.length === 0 || !description) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    const paidSum = paidBy.reduce((acc, p) => acc + Number(p.amount || 0), 0);
    if (Math.abs(paidSum - Number(totalAmount)) > 0.01) {
      Alert.alert("Error", "Sum of paid amounts must equal total expense.");
      return;
    }

    const splitSum = splitBetween.reduce(
      (acc, s) => acc + Number(s.amount || 0),
      0
    );
    if (Math.abs(splitSum - Number(totalAmount)) > 0.01) {
      Alert.alert("Error", "Sum of split amounts must equal total expense.");
      return;
    }

    try {
      setLoading(true);

      const requestBody = {
        groupId: Number(groupId),
        description,
        amount: Number(totalAmount),
        paidByDto: paidBy.map((p) => ({
          userId: p.userId,
          amount: Number(p.amount),
        })),
        splitBetweenDto: splitBetween.map((s) => ({
          userId: s.userId,
          amount: Number(s.amount),
        })),
        madeById: currentUserId,
      };

      await axiosInstance.post("/v1/ExpenseApi", requestBody);

      Alert.alert("Success", "Transaction added successfully.", [
        {
          text: "OK",
          onPress: () => {
            setTotalAmount("");
            setDescription("");
            router.back();
          },
        },
      ]);
    } catch (error: any) {
      console.error(
        "Transaction error:",
        error.response?.status,
        error.message
      );
      Alert.alert("Error", "Failed to add transaction.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#f0f0f0",
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#333" }}>
            New Expense
          </Text>
          <TouchableOpacity onPress={handleAddTransaction}>
            <Ionicons name="checkmark" size={28} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1, paddingHorizontal: 30, paddingVertical: 10 }}
        >
          {/* Group Name Tag */}
          <View
            style={{
              backgroundColor: Colors.accent,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              alignSelf: "flex-start",
              marginBottom: 25,
            }}
          >
            <Text style={{ fontSize: 14, color: Colors.textMuted }}>
              {group?.name}
            </Text>
          </View>

          {/* Description Row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#333",
                width: 100,
              }}
            >
              Description
            </Text>
            <TextInput
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 12,
                borderRadius: 8,
                fontSize: 16,
              }}
              placeholder="What's this expense for?"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Total Amount Row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#333",
                width: 100,
              }}
            >
              Amount
            </Text>
            <TextInput
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 12,
                borderRadius: 8,
                fontSize: 16,
              }}
              placeholder="0.00"
              keyboardType="numeric"
              value={totalAmount}
              onChangeText={setTotalAmount}
            />
          </View>

          {/* Conversational Sentence */}
          <View
            style={{
              backgroundColor: Colors.accent,
              padding: 20,
              borderRadius: 12,
              marginBottom: 30,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, color: "#333" }}>Paid by </Text>
              <TouchableOpacity
                onPress={() => setShowPayerModal(true)}
                style={{ paddingVertical: 2 }}
              >
                <Text
                  style={{
                    color: Colors.primary,
                    fontWeight: "600",
                    textDecorationLine: "underline",
                    fontSize: 16,
                  }}
                >
                  {getPayerText()}
                </Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 16, color: "#333" }}> and split </Text>
              <TouchableOpacity
                onPress={() => setShowSplitTypeModal(true)}
                style={{ paddingVertical: 2 }}
              >
                <Text
                  style={{
                    color: Colors.primary,
                    fontWeight: "600",
                    textDecorationLine: "underline",
                    fontSize: 16,
                  }}
                >
                  {splitType}
                </Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 16, color: "#333" }}> among </Text>
              <TouchableOpacity
                onPress={() => setShowSplitModal(true)}
                style={{ paddingVertical: 2 }}
              >
                <Text
                  style={{
                    color: Colors.primary,
                    fontWeight: "600",
                    textDecorationLine: "underline",
                    fontSize: 16,
                  }}
                >
                  {getSplitText()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Show individual splits if unequal */}
          {splitType === "unequally" && (
            <View style={{ marginBottom: 30 }}>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}
              >
                Split Details
              </Text>
              {splitBetween.map((split) => {
                const member = members.find((m) => m.id === split.userId);
                return (
                  <View
                    key={split.userId}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 12,
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 16, flex: 1 }}>
                      {member?.fullName}
                    </Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: "#ddd",
                        padding: 10,
                        borderRadius: 8,
                        width: 100,
                        textAlign: "right",
                      }}
                      placeholder="0.00"
                      keyboardType="numeric"
                      value={split.amount}
                      onChangeText={(text) =>
                        handleSplitChange(split.userId, text)
                      }
                    />
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Payer Selection Modal */}
        <Modal
          visible={showPayerModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPayerModal(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                maxHeight: "80%",
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}
              >
                Who paid?
              </Text>
              <ScrollView>
                {members.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    onPress={() => togglePayerSelection(member.id)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                    }}
                  >
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 4,
                        borderWidth: 2,
                        borderColor: Colors.primary,
                        marginRight: 12,
                        backgroundColor: selectedPayers.includes(member.id)
                          ? Colors.primary
                          : "white",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {selectedPayers.includes(member.id) && (
                        <Text style={{ color: "white", fontWeight: "bold" }}>
                          ✓
                        </Text>
                      )}
                    </View>
                    <Text style={{ fontSize: 16 }}>{member.fullName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={{ flexDirection: "row", marginTop: 20, gap: 10 }}>
                <TouchableOpacity
                  onPress={() => setShowPayerModal(false)}
                  style={{
                    flex: 1,
                    padding: 15,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: Colors.primary,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: Colors.primary, fontWeight: "600" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePayerSelection}
                  style={{
                    flex: 1,
                    padding: 15,
                    borderRadius: 8,
                    backgroundColor: Colors.primary,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Split Type Modal */}
        <Modal
          visible={showSplitTypeModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowSplitTypeModal(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}
              >
                How to split?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSplitType("equally");
                  setShowSplitTypeModal(false);
                }}
                style={{
                  padding: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                }}
              >
                <Text style={{ fontSize: 16 }}>Equally</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSplitType("unequally");
                  setShowSplitTypeModal(false);
                }}
                style={{
                  padding: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                }}
              >
                <Text style={{ fontSize: 16 }}>Unequally</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowSplitTypeModal(false)}
                style={{
                  padding: 15,
                  marginTop: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: Colors.primary,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: Colors.primary, fontWeight: "600" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Split Between Modal */}
        <Modal
          visible={showSplitModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowSplitModal(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                maxHeight: "80%",
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}
              >
                Split among?
              </Text>
              <ScrollView>
                {members.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    onPress={() => toggleSplitterSelection(member.id)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                    }}
                  >
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 4,
                        borderWidth: 2,
                        borderColor: Colors.primary,
                        marginRight: 12,
                        backgroundColor: selectedSplitters.includes(member.id)
                          ? Colors.primary
                          : "white",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {selectedSplitters.includes(member.id) && (
                        <Text style={{ color: "white", fontWeight: "bold" }}>
                          ✓
                        </Text>
                      )}
                    </View>
                    <Text style={{ fontSize: 16 }}>{member.fullName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={{ flexDirection: "row", marginTop: 20, gap: 10 }}>
                <TouchableOpacity
                  onPress={() => setShowSplitModal(false)}
                  style={{
                    flex: 1,
                    padding: 15,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: Colors.primary,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: Colors.primary, fontWeight: "600" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSplitSelection}
                  style={{
                    flex: 1,
                    padding: 15,
                    borderRadius: 8,
                    backgroundColor: Colors.primary,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

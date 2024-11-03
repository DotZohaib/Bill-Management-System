// pages/index.tsx
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

type User = {
  id: number;
  name: string;
};

type Bill = {
  id: number;
  userId: number;
  userName: string;
  amount: number;
  date: string;
};

const users: User[] = [
  { id: 1, name: "Zohaib" },
  { id: 2, name: "Babar" },
  { id: 3, name: "Mustafa" }
];

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [bills, setBills] = useState<Bill[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const savedBills = localStorage.getItem('billRecords');
    if (savedBills) {
      setBills(JSON.parse(savedBills));
    }
  }, []);

  const saveBill = () => {
    if (!selectedUser) {
      setError('Please select a user');
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      setError('Please enter a valid amount');
      return;
    }

    const newBill: Bill = {
      id: Date.now(),
      userId: selectedUser.id,
      userName: selectedUser.name,
      amount: parseFloat(amount),
      date: new Date().toISOString()
    };

    const updatedBills = [...bills, newBill];
    setBills(updatedBills);
    localStorage.setItem('billRecords', JSON.stringify(updatedBills));
    setAmount('');
    setError('');
  };

  const deleteBill = (billId: number) => {
    const updatedBills = bills.filter(bill => bill.id !== billId);
    setBills(updatedBills);
    localStorage.setItem('billRecords', JSON.stringify(updatedBills));
  };

  const getUserTotal = (userId: number): string => {
    return bills
      .filter(bill => bill.userId === userId)
      .reduce((sum, bill) => sum + bill.amount, 0)
      .toFixed(2);
  };

  const getGrandTotal = (): string => {
    return bills
      .reduce((sum, bill) => sum + bill.amount, 0)
      .toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Bill Record System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* User Selection */}
              <div className="flex gap-4">
                {users.map(user => (
                  <Button
                    key={user.id}
                    variant={selectedUser?.id === user.id ? "default" : "outline"}
                    onClick={() => setSelectedUser(user)}
                  >
                    {user.name}
                  </Button>
                ))}
              </div>

              {/* Amount Input */}
              <div className="flex gap-4">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="max-w-xs"
                />
                <Button onClick={saveBill}>Save Bill</Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

    {/* User Totals */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
  {users.map(user => (
    <Card key={user.id}>
      <CardHeader>
        <CardTitle className="text-lg">{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">₹{getUserTotal(user.id)}</p>
      </CardContent>
    </Card>
  ))}
</div>


        {/* Grand Total */}
        <Card className="mb-8 bg-blue-50">
          <CardHeader>
            <CardTitle>Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{getGrandTotal()}</p>
          </CardContent>
        </Card>

        {/* Bill Records */}
        <Card>
          <CardHeader>
            <CardTitle>Bill History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bills.map(bill => (
                <div key={bill.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{bill.userName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(bill.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold">₹{bill.amount.toFixed(2)}</p>
                    <Button 
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteBill(bill.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

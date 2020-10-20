import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface BalanceFormatted {
  income: string;
  outcome: string;
  total: string;
}

interface Response {
  transactions: Transaction[],
  balance: Balance
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<BalanceFormatted>({} as BalanceFormatted);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const { data } = await api.get<Response>('/transactions');

      setTransactions(data.transactions.map(current => ({
        ...current,
        formattedValue: (current.type === "outcome" ? " - " : "") + formatValue(current.value),
        formattedDate: new Date(current.created_at).toLocaleDateString('pt-BR')
      })))

      const { income, outcome, total } = data.balance;
      setBalance({
        income: formatValue(income),
        outcome: formatValue(outcome),
        total: formatValue(total)
      });
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((current) => (
                <tr key={current.id}>
                  <td className="title">{current.title}</td>
                  <td className={current.type}>{current.formattedValue}</td>
                  <td>{current.category?.title}</td>
                  <td>{current.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;

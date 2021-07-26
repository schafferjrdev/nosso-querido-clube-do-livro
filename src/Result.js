import React, { useEffect, useState } from "react";
import { Popover, Button, Popconfirm, Empty } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import Card from "./Card";

// const irv = (ballots) => {
//   const candidates = [...new Set(ballots.flat())];
//   const votes = Object.entries(
//     ballots.reduce((votes, [v]) => {
//       votes[v] += 1;
//       return votes;
//     }, Object.assign(...candidates.map((c) => ({ [c]: 0 }))))
//   );
//   const [topCand, topCount] = votes.reduce(
//     ([n, m], [v, c]) => (c > m ? [v, c] : [n, m]),
//     ["?", -Infinity]
//   );

//   // eslint-disable-next-line
//   const [bottomCand, bottomCount] = votes.reduce(
//     ([n, m], [v, c]) => (c < m ? [v, c] : [n, m]),
//     ["?", Infinity]
//   );

//   return topCount > ballots.length / 2
//     ? topCand
//     : irv(
//         ballots
//           .map((ballot) => ballot.filter((c) => c !== bottomCand))
//           .filter((b) => b.length > 0)
//       );
// };

let irvW = (ballots, arr = []) => {
  const candidates = [...new Set(ballots.flat())];
  const votes = Object.entries(
    ballots.reduce((votes, [v]) => {
      votes[v] += 1;
      return votes;
    }, Object.assign(...candidates.map((c) => ({ [c]: 0 }))))
  );
  // eslint-disable-next-line
  const [topCand, topCount] = votes.reduce(
    ([n, m], [v, c]) => (c > m ? [v, c] : [n, m]),
    ["?", -Infinity]
  );

  // eslint-disable-next-line
  const [bottomCand, bottomCount] = votes.reduce(
    ([n, m], [v, c]) => (c < m ? [v, c] : [n, m]),
    ["?", Infinity]
  );

  const a = [...arr];
  a.push({ cand: bottomCand, n: bottomCount });

  if (topCount === ballots.length / 2 && candidates.length === 2) {
    return [...candidates.map((e) => ({ cand: e, n: 1 })), ...arr];
  }

  return candidates.length === 1
    ? a.sort(function (a, b) {
        if (a.n < b.n) {
          return 1;
        }
        if (a.n > b.n) {
          return -1;
        }
        // a must be equal to b
        return 0;
      })
    : irvW(
        ballots
          .map((ballot) => ballot.filter((c) => c !== bottomCand))
          .filter((b) => b.length > 0),
        a
      );
};

const Result = ({ books, ballots, onClear }) => {
  const [result, setResult] = useState([]);
  useEffect(() => {
    if (ballots.length > 0) {
      const onlyVotes = ballots.map((b) => b.ballot);
      const irvWinner = irvW(onlyVotes);
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      const total = irvWinner.map((e) => e.n).reduce(reducer);
      console.log(irvWinner);
      const booksList = irvWinner.map((el) => {
        const percent = `${Math.round((el.n * 100) / total)}%`;
        return { nome: el.cand, pref: percent };
      });
      setResult(booksList);
    }
  }, [ballots, books]);

  return (
    <div className="results">
      <Card
        title="Votantes"
        extra={
          <Button
            type="link"
            disabled={ballots.length === 0}
            className="icon-button"
            icon={
              <Popconfirm
                placement="left"
                title="Apagar todas as votações?"
                onConfirm={() => onClear()}
                okText="Sim"
                cancelText="Não"
              >
                <ClearOutlined />
              </Popconfirm>
            }
          />
        }
      >
        {ballots.map((e, i) => (
          <p key={i} className="voters-item">
            <Popover
              title={`Escolhas de ${e?.nome}`}
              placement="right"
              content={
                <div>
                  {e.ballot.map((e) => (
                    <p>{e}</p>
                  ))}
                  <p className="voters-date">
                    <i>Votou em: {e?.data}</i>
                  </p>
                </div>
              }
            >
              <span>{e?.nome}</span>
            </Popover>
          </p>
        ))}

        {ballots.length === 0 ? (
          <Empty description="Ninguém votou ainda..." />
        ) : (
          <p className="voters-date">Total: {ballots.length}</p>
        )}
      </Card>
      <Card title="Resultado">
        {ballots.length > 0 ? (
          result?.map((e, i) => (
            <p key={i}>
              {e.nome} - {e.pref}
            </p>
          ))
        ) : (
          <Empty description="Sem vencedores ainda" />
        )}
      </Card>
    </div>
  );
};

export default Result;

import React, { useState, useEffect } from "react";
import firebase from "./firebase";
import { Button, Input, Tooltip, Breadcrumb } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Result from "./Result";
import Votation from "./Votation";
import "./App.less";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function App() {
  const rootRef = firebase.database().ref();
  const [books, setBooks] = useState([]);
  const [ballots, setBallots] = useState([]);
  const [voted, setVoted] = useState(false);
  const [voter, setVoter] = useState("");

  useEffect(() => {
    try {
      rootRef.on(
        "value",
        function (snapshot) {
          const response = snapshot.val();
          setBooks(response.livros);
          const keys = Object.keys(response?.votantes ?? []);
          console.log(keys);
          setBallots(keys.map((e) => response.votantes[e]));
        },
        function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        }
      );
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line
  }, []);

  const handleVote = () => {
    const ballot = books.map((e) => e.nome);
    const date = new Date();
    rootRef
      .child("votantes")
      .push({ nome: voter, ballot: ballot, data: date.toLocaleString() });
    setVoted(true);
  };

  const handleSort = (i, e) => {
    setBooks((prev) => {
      const reordered = reorder(prev, i, e);
      return reordered;
    });
  };

  const handleClear = () => {
    rootRef.child("votantes").remove();
  };

  const backToVotes = () => {
    setVoted(false);
    setVoter("");
  };

  const toResults = () => {
    setVoted(true);
    setVoter("");
  };

  return (
    <div className="app">
      <header>
        Nosso querido clube do livro
        <Breadcrumb>
          <Breadcrumb.Item>
            {/* eslint-disable-next-line*/}
            <a onClick={backToVotes}>Votação</a>
          </Breadcrumb.Item>
          {voted && (
            <Breadcrumb.Item>
              {/* eslint-disable-next-line*/}
              <a onClick={toResults}>Resultados</a>
            </Breadcrumb.Item>
          )}
        </Breadcrumb>
      </header>

      <main>
        {!voted ? (
          <div>
            <h3>Participante</h3>
            <Input
              placeholder="Seu nome"
              style={{ marginBottom: "12px" }}
              className="inputs-voting"
              value={voter}
              onChange={(e) => setVoter(e.target.value)}
              allowClear
            />
            <h3>
              Livros{" "}
              <Tooltip
                placement="right"
                title="Arraste para montar a ordem de preferência"
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </h3>

            <Votation books={books} handleSort={handleSort} />
            <Tooltip
              placement="bottom"
              title={!voter ? "Precisa colocar um nome antes" : null}
            >
              <Button
                disabled={!voter}
                type="primary"
                onClick={handleVote}
                className={`${
                  voter ? "inputs-voting button" : "inputs-voting-disabled"
                }`}
                style={{ marginTop: "12px", width: "100%" }}
              >
                Votar
              </Button>
            </Tooltip>
          </div>
        ) : (
          <Result ballots={ballots} books={books} onClear={handleClear} />
        )}
      </main>
    </div>
  );
}

export default React.memo(App);

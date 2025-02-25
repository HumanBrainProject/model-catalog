import React from "react";
import axios from "axios";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import Markdown from "react-markdown";

import { baseUrl } from "./globals";
import { formatTimeStampToLongString } from "./utils";

function getComments(auth, from_index, size) {
  const url = `${baseUrl}/comments/?status=submitted&size=${size}&from_index=${from_index}`;
  const config = {
    headers: {
      Authorization: "Bearer " + auth.token,
    },
  };
  return axios.get(url, config);
}

function getSubject(auth, subjectUri) {
  const url = `${baseUrl}${subjectUri}`;
  const config = {
    headers: {
      Authorization: "Bearer " + auth.token,
    },
  };
  return axios.get(url, config);
}

function formatName(person) {
  return `${person.given_name} ${person.family_name}`;
}

function getSubjectInfo(subjectUri) {
  const subjectParts = subjectUri.split("/");
  const subjectType = subjectParts[1].slice(0, subjectParts[1].length - 1);
  const subjectUUID = subjectParts[2];
  return { type: subjectType, uuid: subjectUUID };
}

function CommentCard(props) {
  const subjectInfo = getSubjectInfo(props.comment.about);
  const subjectUrl = `https://model-catalog.apps.ebrains.eu/#${subjectInfo.type}_id.${subjectInfo.uuid}`;

  const handlePublish = () => {
    props.handlePublish(props.comment.id);
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Comment by: {formatName(props.comment.commenter)} on{" "}
          {formatTimeStampToLongString(props.comment.timestamp)}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          About {subjectInfo.type}:{" "}
          <a href={subjectUrl}>{props.subject.name}</a>
        </Typography>
        <Markdown>{props.comment.content}</Markdown>
      </CardContent>
      <CardActions>
        <Button color="primary" onClick={handlePublish}>Publish</Button>
      </CardActions>
    </Card>
  );
}

export default function CommentManager(props) {
  //const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [comments, setComments] = React.useState([]);
  const [subjects, setSubjects] = React.useState({});

  React.useEffect(() => {
    setLoading(true);
    getComments(props.auth, 0, 100)
      .then((res) => {
        console.log("Got comments");

        setComments(res.data);
        const subjectInfo = {};
        Promise.all(
          res.data.map((comment) => getSubject(props.auth, comment.about))
        ).then((responses) => {
          for (const res2 of responses) {
            //console.log(res2);
            subjectInfo[res2.data.id] = res2.data;
          }
          console.log(subjectInfo);
          setSubjects(subjectInfo);
          setLoading(false);
        });
      })
      .catch((err) => {
        setErrorMessage("Error loading comments: ", err.message);
        setLoading(false);
      });
  }, []);

  const handlePublish = (commentId) => {
    console.log(`Publishing ${commentId}`);
    const url=`${baseUrl}/comments/${commentId}`;
    const config = {
      headers: {
        Authorization: "Bearer " + props.auth.token,
      },
    };
    axios.put(url, {status: "published"}, config).then((res) => {
      setComments(comments.filter((comment) => comment.id !== commentId));
    })
  }


  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "200px",
        }}
      >
        <CircularProgress />
      </div>
    );
  } else if (errorMessage) {
    return (
      <div>
        <p>{errorMessage}</p>
      </div>
    );
  } else {
    return (
      <Container maxWidth="lg" style={{ marginTop: "100px" }}>
        <Grid container spacing={4}>
          {comments.map((comment) => (
            <CommentCard
              comment={comment}
              subject={subjects[getSubjectInfo(comment.about).uuid]}
              handlePublish={handlePublish}
            />
          ))}
        </Grid>
      </Container>
    );
  }
}

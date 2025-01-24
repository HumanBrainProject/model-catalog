import React from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  TextField,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import { datastore } from "./datastore";
import Markdown from "./Markdown";
import Theme from "./theme";
import {
  formatTimeStampAsDate,
  formatTimeStampToLongString,
  formatTimeStampToCompact,
} from "./utils";

function CommentEditor(props) {
  return (
    <React.Fragment>
      <TextField
        id={props.id}
        placeholder="Use Markdown to format your comment"
        value={props.content}
        onChange={props.onChange}
        multiline
        minRows={4}
        variant="outlined"
        style={{ width: "100%" }}
      />
      <Button onClick={props.handleCancel} color="default">
        Cancel
      </Button>
      <Button onClick={() => props.handleSave({submit: false})} color="primary">
        Save draft
      </Button>
      <Button onClick={() => props.handleSave({submit: true})} color="primary">
        Submit comment
      </Button>
    </React.Fragment>
  );
}

function CommentToolbar(props) {

  const editButton = (hide) => {
    if (hide) {
      return "";
    } else {
      return (<IconButton
      aria-label="edit"
      size="small"
      onClick={() => props.handleSetEditing(true)}
    >
      <EditIcon />
    </IconButton>)
    }
  }

  return (
    <Grid
      container
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: Theme.mediumBackground,
      }}
    >
      <Grid item xs={6}>
        <Box px={2} py={1} display="flex" flexDirection="row">
          <Typography variant="subtitle2">
            <b>
              {props.comment.commenter.given_name}&nbsp;
              {props.comment.commenter.family_name}
            </b>
            &nbsp;
          </Typography>
          <Typography variant="caption">
            {formatTimeStampToLongString(props.comment.timestamp)}
            &nbsp;
          </Typography>
          <Typography variant="caption">({props.comment.status})</Typography>
        </Box>
      </Grid>
      <Grid container item justifyContent="flex-end" xs={6}>
        <Box
          px={2}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" color="textSecondary">
            ID: {props.comment.id}
          </Typography>
          {props.comment.status === "draft" ? editButton(props.editing) : ""}
          {props.canDelete ? (
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => props.handleDelete(props.comment.id)}
            >
              <DeleteIcon />
            </IconButton>
          ) : (
            ""
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

function CommentBox(props) {
  const [content, setContent] = React.useState("");
  const [editing, setEditing] = React.useState(props.openEditor);

  React.useEffect(() => {
    if (content === "") {
      setContent(props.comment.content);
    }
  });

  const onChange = (event) => {
    setContent(event.target.value);
  };

  const handleCancel = () => {
    console.log(props.comment);
    setContent(props.comment.content || "");
    setEditing(props.openEditor);
  };

  const handleSave = ({submit = false}) => {
    setEditing(props.openEditor);
    props.handleSave(content, submit);
    if (props.openEditor) {
      setContent("");
    }
  };

  return (
    <Grid item xs={12} key={props.comment.id}>
      {/* top bar */}
      {props.comment.id ? (
        <CommentToolbar
          comment={props.comment}
          canDelete={props.canDelete}
          handleSetEditing={setEditing}
          handleDelete={props.handleDelete}
          editing={editing}
        />
      ) : (
        <Typography variant="h6">Add a comment</Typography>
      )}
      {/* main content */}
      <Box
        px={2}
        py={1}
        style={{
          backgroundColor: Theme.lightBackground,
        }}
      >
        {editing ? (
          <CommentEditor
            id={props.comment.id}
            content={content}
            onChange={onChange}
            handleCancel={handleCancel}
            handleSave={handleSave}
          />
        ) : (
          <Markdown source={content} />
        )}
      </Box>
    </Grid>
  );
}

function DiscussionPanel(props) {
  const signal = axios.CancelToken.source();

  const [comments, setComments] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [newComment, setNewComment] = React.useState({});
  const [waiting, setWaiting] = React.useState(false);

  const getComments = (objId) => {
    return datastore
      .getComments(objId, signal)
      .then((comments) => {
        setComments(comments);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Error: ", err.message);
        } else {
          // Something went wrong. Save the error in state and re-render.
          this.setError(err);
        }
      });
  };

  React.useEffect(() => {
    getComments(props.id);
  });

  const canDelete = (comment) => {
    let deletable = comment.status === "draft";
    return deletable;
  };

  const handleDelete = (commentId) => {
    datastore.deleteComment(props.id, commentId).then(() => {
      getComments(props.id);
    });
  };

  const saveComment = (commentId, content, submit) => {
    if (commentId === "new") {
      console.log("Saving new comment");
      setWaiting(true);
      datastore.createComment(props.id, content, signal).then((res) => {
        if (submit) {
          datastore
            .updateComment(props.id, res.data.id, null, submit, signal)
            .then((res) => {
              console.log(res.data);
              setNewComment({});
              getComments(props.id);
              setWaiting(false);
            });
        } else {
          console.log(res.data);
          setNewComment({});
          getComments(props.id);
          setWaiting(false);
        }
      });
    } else {
      console.log("Modifying comment");
      datastore
        .updateComment(props.id, commentId, content, submit, signal)
        .then((res) => {
          console.log(res.data);
          getComments(props.id);
        });
    }
  };

  let message = "";
  if (comments.length === 0) {
    message = (
      <Grid item xs={12}>
        <p>{props.emptyMessage}</p>
      </Grid>
    );
  }
  return (
    <Grid container direction="column" spacing={1}>
      {message}
      {comments.map((comment) => (
        <CommentBox
          key={comment.id}
          openEditor={false}
          comment={comment}
          canDelete={canDelete(comment)}
          handleDelete={handleDelete}
          handleSave={(content, submit) => saveComment(comment.id, content, submit)}
        />
      ))}
      { waiting ? <Grid item xs={12}><CircularProgress/></Grid> : "" }
      <CommentBox
        key="new"
        openEditor={true}
        comment={newComment}
        canDelete={false}
        handleDelete={null}
        handleSave={(content, submit) => saveComment("new", content, submit)}
      />
    </Grid>
  );
}

export default DiscussionPanel;

import { Button, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddToQueueIcon from "@material-ui/icons/AddToQueue";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import EditIcon from "@material-ui/icons/Edit";
import RemoveFromQueueIcon from "@material-ui/icons/RemoveFromQueue";
import { withSnackbar } from "notistack";
import React from "react";
import ContextMain from "../../ContextMain";
import ErrorDialog from "../layout/ErrorDialog";
import LoadingIndicator from "../layout/LoadingIndicator";
import Markdown from "../layout/Markdown";
import ModelInstanceAddForm from "../forms/ModelInstanceAddForm";
import ModelInstanceEditForm from "../forms/ModelInstanceEditForm";
import Theme from "../../utils/theme";
import {
    copyToClipboard,
    formatTimeStampAsDate,
    showNotification,
} from "../../utils/utils";
import Avatar from "@material-ui/core/Avatar";


function getDownloadURL(source_url) {
    const url_obj = new URL(source_url)
    if (url_obj.hostname === "object.cscs.ch") {
        const prefix = url_obj.searchParams.get("prefix")
        if (prefix) {
            return `${url_obj.origin}${url_obj.pathname}/${prefix}`;
        }
    }
    return source_url;
}

function openBlueNaaS(model_inst_url) {
    let match = model_inst_url.match(
        /https:\/\/object\.cscs\.ch\/v1\/AUTH_([^]+?)\//gi
    );
    let model_inst_path = model_inst_url.replace(match, "");
    match = model_inst_path.match(/\?bluenaas=true/gi);
    model_inst_path = model_inst_path.replace(match, "");
    window.open(
        "https://blue-naas.humanbrainproject.eu/#/url/" + model_inst_path,
        "_blank"
    );
}

function viewMorphology(model_inst_morph_url) {
    // var url_collab = encodeURIComponent("https://collab.humanbrainproject.eu/#/collab/" + ids.collab_id + "/nav/" + ids.app_id + "?state=model." + model_id + ",external")
    var url =
        "https://neuroinformatics.nl/HBP/morphology-viewer-dev/?url=" +
        model_inst_morph_url; // + "&referrer=" + url_collab;
    window.open(url, "_blank");
}

function InstanceParameter(props) {
    if (props.value) {
        if (props.label === "Source" && props.value.match(/bluenaas=true/gi)) {
            // contains 'bluenaas=true' in URL
            return (
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="body2">
                            <b>{props.label}: </b>
                        </Typography>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={9}>
                            <Box
                                component="div"
                                my={2}
                                bgcolor="white"
                                overflow="auto"
                                border={1}
                                borderColor="grey.500"
                                borderRadius={10}
                                style={{ padding: 10, cursor: "pointer" }}
                                whiteSpace="nowrap"
                                onClick={() =>
                                    copyToClipboard(
                                        props.value,
                                        props.enqueueSnackbar,
                                        props.closeSnackbar,
                                        props.label + " copied"
                                    )
                                }
                            >
                                {props.value}
                            </Box>
                        </Grid>
                        <Grid item xs={3}>
                            <Box component="div" my={2}>
                                <Button
                                    variant="contained"
                                    style={{
                                        backgroundColor: Theme.buttonPrimary,
                                        textTransform: "none",
                                    }}
                                    onClick={() => openBlueNaaS(props.value)}
                                >
                                    Launch BlueNaaS
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            );
        } else if (props.label === "Morphology") {
            return (
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="body2">
                            <b>{props.label}: </b>
                        </Typography>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={9}>
                            <Box
                                component="div"
                                my={2}
                                bgcolor="white"
                                overflow="auto"
                                border={1}
                                borderColor="grey.500"
                                borderRadius={10}
                                style={{ padding: 10, cursor: "pointer" }}
                                whiteSpace="nowrap"
                                onClick={() =>
                                    copyToClipboard(
                                        props.value,
                                        props.enqueueSnackbar,
                                        props.closeSnackbar,
                                        props.label + " copied"
                                    )
                                }
                            >
                                {props.value}
                            </Box>
                        </Grid>
                        <Grid item xs={3}>
                            <Box component="div" my={2}>
                                <Button
                                    variant="contained"
                                    style={{
                                        backgroundColor: Theme.buttonPrimary,
                                        textTransform: "none",
                                    }}
                                    onClick={() => viewMorphology(props.value)}
                                >
                                    View Morphology
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="body2">
                            <b>{props.label}: </b>
                        </Typography>
                        <Box
                            component="div"
                            my={2}
                            bgcolor="white"
                            overflow="auto"
                            border={1}
                            borderColor="grey.500"
                            borderRadius={10}
                            style={{ padding: 10, cursor: "pointer" }}
                            whiteSpace="nowrap"
                            onClick={() =>
                                copyToClipboard(
                                    props.value,
                                    props.enqueueSnackbar,
                                    props.closeSnackbar,
                                    props.label + " copied"
                                )
                            }
                        >
                            {props.value}
                        </Box>
                    </Grid>
                </Grid>
            );
        }
    } else {
        return "";
    }
    // return <Typography variant="body2"><b>{props.label}: </b>{props.value}</Typography>
}

function CompareIcon(props) {
    if (props.compareFlag) {
        return (
            <Tooltip title="Remove model instance from compare" placement="top">
                <IconButton
                    aria-label="compare model"
                    onClick={() =>
                        props.removeModelInstanceCompare(props.instance_id)
                    }
                >
                    <RemoveFromQueueIcon color="action" />
                </IconButton>
            </Tooltip>
        );
    } else {
        return (
            <Tooltip title="Add model instance to compare" placement="top">
                <IconButton
                    aria-label="compare model"
                    onClick={() =>
                        props.addModelInstanceCompare(props.instance_id)
                    }
                >
                    <AddToQueueIcon color="action" />
                </IconButton>
            </Tooltip>
        );
    }
}

function AlternateRepresentationLinkOut(props) {
    if (props.instance.alternatives.length > 0) {
        let link_outs = [];
        props.instance.alternatives.forEach(url => {
            let title = "";
            let imgUrl = "";
            let imgAlt = "";
            if (url.includes("search.kg.ebrains.eu")) {
                title = "View this version in the KG Search app";
                imgUrl = "/docs/static/img/ebrains_logo.png";
                imgAlt = "Link to EBRAINS Knowledge Graph Search";
            }
            if (url.includes("modeldb")) {
                title = "View this version in ModelDB";
                imgUrl = "/docs/static/img/senselab_logo.jpg";
                imgAlt = "Link to ModelDB";
            }
            if (imgUrl) {
                link_outs.push(
                    <Tooltip title={title} placement="top">
                        <IconButton href={url} target="_blank" rel="noopener">
                            <Avatar alt={imgAlt} src={imgUrl} />
                        </IconButton>
                    </Tooltip>
                );
            }
        })
        return link_outs;
    } else {
        return "";
    }
}

class ModelDetailContent extends React.Component {
    static contextType = ContextMain;

    constructor(props, context) {
        super(props, context);

        this.state = {
            openAddInstanceForm: false,
            openEditInstanceForm: false,
            instancesWithResults: this.props.results
                ? [
                      ...new Set(
                          this.props.results.map((a) => a.model_instance_id)
                      ),
                  ]
                : null,
            currentInstance: null,
            errorEditModelInstance: null,
        };
        this.handleAddModelInstanceFormClose =
            this.handleAddModelInstanceFormClose.bind(this);
        this.handleEditModelInstanceFormClose =
            this.handleEditModelInstanceFormClose.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleErrorEditDialogClose =
            this.handleErrorEditDialogClose.bind(this);
        this.checkInstanceInCompare = this.checkInstanceInCompare.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.results !== prevProps.results) {
            this.setState({
                instancesWithResults: [
                    ...new Set(
                        this.props.results.map((a) => a.model_instance_id)
                    ),
                ],
            });
        }
    }

    handleErrorEditDialogClose() {
        this.setState({ errorEditModelInstance: null });
    }

    handleAddModelInstanceFormClose(newModelInstance) {
        this.setState({ openAddInstanceForm: false });
        if (newModelInstance) {
            this.props.onAddModelInstance(newModelInstance);
            showNotification(
                this.props.enqueueSnackbar,
                this.props.closeSnackbar,
                "Model instance added!",
                "success"
            );
        }
    }

    handleEditModelInstanceFormClose(modelInstance) {
        this.setState({ openEditInstanceForm: false });
        if (modelInstance) {
            this.props.onEditModelInstance(modelInstance);
            showNotification(
                this.props.enqueueSnackbar,
                this.props.closeSnackbar,
                "Model instance edited!",
                "success"
            );
        }
    }

    handleEditClick(instance) {
        if (this.state.instancesWithResults.includes(instance.id)) {
            this.setState({
                errorEditModelInstance:
                    "This model instance cannot be edited as there are validation results associated with it!",
            });
        } else {
            this.setState({
                openEditInstanceForm: true,
                currentInstance: instance,
            });
        }
    }

    checkInstanceInCompare(model_id, model_inst_id) {
        let [compareModels] = this.context.compareModels;
        // check if model exists in compare
        if (!(model_id in compareModels)) {
            return false;
        }
        // check if this model instance already added to compare
        if (model_inst_id in compareModels[model_id].selected_instances) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        let errorMessage = "";
        if (this.state.errorEditModelInstance) {
            errorMessage = (
                <ErrorDialog
                    open={Boolean(this.state.errorEditModelInstance)}
                    handleErrorDialogClose={this.handleErrorEditDialogClose}
                    error={
                        this.state.errorEditModelInstance.message ||
                        this.state.errorEditModelInstance
                    }
                />
            );
        }

        let addInstanceForm = "";
        if (this.state.openAddInstanceForm) {
            addInstanceForm = (
                <ModelInstanceAddForm
                    open={this.state.openAddInstanceForm}
                    onClose={this.handleAddModelInstanceFormClose}
                    modelID={this.props.id}
                    modelScope={this.props.modelScope}
                />
            );
        }

        let editInstanceForm = "";
        if (this.state.openEditInstanceForm) {
            editInstanceForm = (
                <ModelInstanceEditForm
                    open={this.state.openEditInstanceForm}
                    onClose={this.handleEditModelInstanceFormClose}
                    instance={this.state.currentInstance}
                    modelID={this.props.id}
                    modelScope={this.props.modelScope}
                />
            );
        }

        let addNewVersionButton = "";
        if (this.props.canEdit) {
            addNewVersionButton = (
                <Button
                    variant="contained"
                    style={{ backgroundColor: Theme.buttonPrimary }}
                    onClick={() => this.setState({ openAddInstanceForm: true })}
                >
                    Add new version
                </Button>
            );
        }

        let noInstances = "";
        if (this.props.loading) {
            noInstances = <LoadingIndicator />;
        } else {
            noInstances = (
                <Typography variant="h6">
                    <br />
                    No model instances have yet been registered for this model.
                </Typography>
            );
        }

        return (
            <React.Fragment>
                {}
                <Grid container direction="column">
                    <Grid item xs={12}>
                        <Box>
                            <Typography>
                                <b>Description: </b>
                            </Typography>
                            <Markdown source={this.props.description} />
                            <br />
                            <br />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container direction="row">
                            <Grid item xs={6}>
                                <Typography variant="subtitle1">
                                    <b>Versions</b>
                                </Typography>
                            </Grid>
                            <Grid container item justifyContent="flex-end" xs={6}>
                                {addNewVersionButton}
                            </Grid>
                        </Grid>
                        {this.props.instances.length === 0
                            ? noInstances
                            : this.props.instances.map((instance) => (
                                  <Box
                                      my={2}
                                      pb={0}
                                      style={{
                                          backgroundColor:
                                              Theme.lightBackground,
                                      }}
                                      key={instance.id}
                                  >
                                      <Grid
                                          container
                                          style={{
                                              display: "flex",
                                              alignItems: "center",
                                              backgroundColor:
                                                  Theme.tableHeader,
                                          }}
                                      >
                                          <Grid item xs={6}>
                                              <Box
                                                  px={2}
                                                  display="flex"
                                                  flexDirection="row"
                                              >
                                                  <p variant="subtitle2">
                                                      Version:{" "}
                                                      <span
                                                          style={{
                                                              cursor: "pointer",
                                                              fontWeight:
                                                                  "bold",
                                                          }}
                                                          onClick={() =>
                                                              copyToClipboard(
                                                                  instance.version,
                                                                  this.props
                                                                      .enqueueSnackbar,
                                                                  this.props
                                                                      .closeSnackbar,
                                                                  "Model version copied"
                                                              )
                                                          }
                                                      >
                                                          {instance.version}
                                                      </span>
                                                  </p>
                                                  <AlternateRepresentationLinkOut
                                                      instance={instance}
                                                  />
                                                  {this.state
                                                      .instancesWithResults &&
                                                      this.props.canEdit && (
                                                          <Tooltip
                                                              placement="top"
                                                              title={
                                                                  this.state.instancesWithResults.includes(
                                                                      instance.id
                                                                  )
                                                                      ? "Cannot Edit"
                                                                      : "Edit"
                                                              }
                                                          >
                                                              <IconButton
                                                                  aria-label="edit model instance"
                                                                  onClick={() =>
                                                                      this.handleEditClick(
                                                                          instance
                                                                      )
                                                                  }
                                                              >
                                                                  <EditIcon />
                                                              </IconButton>
                                                          </Tooltip>
                                                      )}
                                                  <Tooltip
                                                      placement="top"
                                                      title="Download model instance"
                                                  >
                                                      <IconButton
                                                          aria-label="download code"
                                                          href={getDownloadURL(instance.source)}
                                                      >
                                                          <CloudDownloadIcon />
                                                      </IconButton>
                                                  </Tooltip>
                                                  <CompareIcon
                                                      compareFlag={this.checkInstanceInCompare(
                                                          this.props.id,
                                                          instance.id
                                                      )}
                                                      instance_id={instance.id}
                                                      addModelInstanceCompare={
                                                          this.props
                                                              .addModelInstanceCompare
                                                      }
                                                      removeModelInstanceCompare={
                                                          this.props
                                                              .removeModelInstanceCompare
                                                      }
                                                  />
                                              </Box>
                                          </Grid>
                                          <Grid
                                              container
                                              item
                                              justifyContent="flex-end"
                                              xs={6}
                                          >
                                              <Box
                                                  px={2}
                                                  style={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      justifyContent: "center",
                                                  }}
                                              >
                                                  <Typography
                                                      variant="body2"
                                                      color="textSecondary"
                                                  >
                                                      ID:{" "}
                                                      <span
                                                          style={{
                                                              cursor: "pointer",
                                                          }}
                                                          onClick={() =>
                                                              copyToClipboard(
                                                                  instance.id,
                                                                  this.props
                                                                      .enqueueSnackbar,
                                                                  this.props
                                                                      .closeSnackbar,
                                                                  "Model instance UUID copied"
                                                              )
                                                          }
                                                      >
                                                          {instance.id}
                                                      </span>
                                                  </Typography>
                                              </Box>
                                          </Grid>
                                      </Grid>
                                      <Box p={2}>
                                          <Typography
                                              variant="body2"
                                              color="textSecondary"
                                              style={{ marginBottom: 10 }}
                                          >
                                              {formatTimeStampAsDate(
                                                  instance.timestamp
                                              )}
                                          </Typography>
                                          <InstanceParameter
                                              label="Description"
                                              value={instance.description}
                                              enqueueSnackbar={
                                                  this.props.enqueueSnackbar
                                              }
                                              closeSnackbar={
                                                  this.props.closeSnackbar
                                              }
                                          />
                                          <InstanceParameter
                                              label="Source"
                                              value={instance.source}
                                              enqueueSnackbar={
                                                  this.props.enqueueSnackbar
                                              }
                                              closeSnackbar={
                                                  this.props.closeSnackbar
                                              }
                                          />
                                          <InstanceParameter
                                              label="Parameters"
                                              value={instance.parameters}
                                              enqueueSnackbar={
                                                  this.props.enqueueSnackbar
                                              }
                                              closeSnackbar={
                                                  this.props.closeSnackbar
                                              }
                                          />
                                          <InstanceParameter
                                              label="Morphology"
                                              value={instance.morphology}
                                              enqueueSnackbar={
                                                  this.props.enqueueSnackbar
                                              }
                                              closeSnackbar={
                                                  this.props.closeSnackbar
                                              }
                                          />
                                          <InstanceParameter
                                              label="Code format"
                                              value={instance.code_format}
                                              enqueueSnackbar={
                                                  this.props.enqueueSnackbar
                                              }
                                              closeSnackbar={
                                                  this.props.closeSnackbar
                                              }
                                          />
                                          <InstanceParameter
                                              label="License"
                                              value={instance.license}
                                              enqueueSnackbar={
                                                  this.props.enqueueSnackbar
                                              }
                                              closeSnackbar={
                                                  this.props.closeSnackbar
                                              }
                                          />
                                      </Box>
                                  </Box>
                              ))}
                    </Grid>

                    <Grid item>{/* todo: images */}</Grid>
                </Grid>
                <div>{addInstanceForm}</div>
                <div>{editInstanceForm}</div>
                <div>{errorMessage}</div>
            </React.Fragment>
        );
    }
}

export default withSnackbar(ModelDetailContent);

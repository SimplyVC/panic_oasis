import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { forbidExtraProps } from 'airbnb-prop-types';
import PropTypes from 'prop-types';
import { ToastsStore } from 'react-toasts';
import { getConfig } from '../../utils/data';
import { nodesConfig } from '../../utils/templates';
import { toBool } from '../../utils/string';
import {
  fieldEmpty,
  fieldValueUniqueAmongAllfieldsInJSON,
  fixSpecificSectionsOfConfig,
  highestItemIndexInConfig,
  keepSpecificSectionsFromConfig,
} from '../../utils/configs';
import Page from '../../components/page';
import { RemoveButton, SaveConfigButton } from '../../components/buttons';
import AddNodeForm from '../../components/forms/add_node_form';
import { NODE_CONFIG_TYPE } from '../../utils/constants';
import { generateAddedTableValues } from '../../utils/forms';
import '../../style/style.css';

function NodesTableContent({ nodesConfigJson, handleRemoveNode }) {
  const content = [];
  const nodes = nodesConfigJson;
  if (Object.keys(nodes).length === 0) {
    content.push(
      <tr key="no-content-key">
        <td colSpan="10" className="date-style">
          No nodes for monitoring added yet! Use the form above to add nodes.
        </td>
      </tr>,
    );
    return content;
  }

  Object.entries(nodes).forEach(([node, data]) => {
    content.push(
      <tr key={node}>
        {generateAddedTableValues(data.node_name, false)}
        {generateAddedTableValues(data.chain_name, false)}
        {generateAddedTableValues(data.node_api_url, false)}
        {generateAddedTableValues(data.node_public_key, false)}
        {generateAddedTableValues(data.node_exporter_url, false)}
        {generateAddedTableValues(data.monitor_node, true)}
        {generateAddedTableValues(data.use_as_data_source, true)}
        {generateAddedTableValues(data.is_archive_node, true)}
        {generateAddedTableValues(data.node_is_validator, true)}
        <td>
          <RemoveButton
            itemKey={parseInt(node.substr(node.indexOf('_') + 1, node.length),
            10)}
            handleRemove={handleRemoveNode}
          />
        </td>
      </tr>,
    );
  });

  return content;
}

function NodesTable({ nodesConfigJson, handleRemoveNode }) {
  return (
    <div>
      <h1 className="heading-style-1" style={{ marginBottom: '-10px' }}>
        Added Nodes
      </h1>
      <Table responsive className="tables-style">
        <thead>
          <tr>
            <th>Name</th>
            <th>Chain</th>
            <th>Node API Url</th>
            <th className="column-style">Node Public Key</th>
            <th className="column-style">Node Exporter</th>
            <th className="column-style">Monitor Node</th>
            <th className="column-style">Data Source</th>
            <th className="column-style">Archive</th>
            <th className="column-style">Validator</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <NodesTableContent
            nodesConfigJson={nodesConfigJson}
            handleRemoveNode={handleRemoveNode}
          />
        </tbody>
      </Table>
    </div>
  );
}

function NodesConfig({
  handleAddNode, handleChangeInNonBooleanField, handleChangeInBooleanField,
  currentNodeConfig, currentNodeIndex, validated, nodeNameValid, chainNameValid,
  nodeAPIUrlValid, nodePubKeyValid, nodeExporterUrlValid, nodesConfigJson,
  handleRemoveNode,
}) {
  return (
    <Container>
      <h1 className="heading-style-1">Nodes Configuration</h1>
      <AddNodeForm
        handleAddNode={handleAddNode}
        handleChangeInNonBooleanField={handleChangeInNonBooleanField}
        handleChangeInBooleanField={handleChangeInBooleanField}
        currentNodeConfig={currentNodeConfig}
        currentNodeIndex={currentNodeIndex}
        validated={validated}
        nodeNameValid={nodeNameValid}
        chainNameValid={chainNameValid}
        nodeAPIUrlValid={nodeAPIUrlValid}
        nodePubKeyValid={nodePubKeyValid}
        nodeExporterUrlValid={nodeExporterUrlValid}
      />
      <NodesTable
        nodesConfigJson={nodesConfigJson}
        handleRemoveNode={handleRemoveNode}
      />
      {
        Object.keys(nodesConfigJson).length > 0 && (
          <SaveConfigButton
            configName="user_config_nodes.ini"
            config={nodesConfigJson}
          />
        )
      }
    </Container>
  );
}

class NodesSettingsPage extends Component {
  constructor(props) {
    super(props);
    // We need to set a timer that tries to get data periodically until the
    // data is fetched. This must be done since data from the config must be
    // fetched once.
    this.dataTimer = null;
    this.state = {
      nodesConfigJson: {},
      currentNodeConfig: Object.create(
        nodesConfig, Object.getOwnPropertyDescriptors(nodesConfig),
      ),
      isFetchingData: true,
      currentNodeIndex: 0,
      validated: false,
    };
  }

  componentDidMount() {
    this.fetchNodesConfig();
    this.dataTimer = setInterval(this.fetchNodesConfig.bind(this), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.dataTimer);
    this.dataTimer = null;
  }

  async fetchNodesConfig() {
    let response;
    try {
      response = await getConfig('user_config_nodes.ini');
    } catch (e) {
      if (e.response) {
        // The request was made and the server responded
        // with a status code that falls out of the range of
        // 2xx
        ToastsStore.error(
          `Error: ${e.response.data.error}`, 5000,
        );
      } else {
        // Something happened in setting up the request that
        // triggered an Error
        ToastsStore.error(`Error: ${e.message}`, 5000);
      }
      return;
    }
    // Remove timer since data was obtained
    clearInterval(this.dataTimer);
    this.dataTimer = null;
    const nodesConfigJson = response.data.result;
    if (nodesConfigJson !== undefined
      && Object.keys(nodesConfigJson).length !== 0) {
      // Since we need to store nodes in the config under the section 'node_i',
      // the current index must always be one greater than the highest i in
      // 'node_i' from the nodes_config.
      const highestNodeIndex = highestItemIndexInConfig(
        nodesConfigJson, 'node_',
      );
      let checkedConfig = fixSpecificSectionsOfConfig(
        response.data.result, nodesConfig, 'node_',
      );
      checkedConfig = keepSpecificSectionsFromConfig(checkedConfig, 'node_');
      this.setState({
        nodesConfigJson: checkedConfig,
        isFetchingData: false,
        currentNodeIndex: highestNodeIndex + 1,
      });
    } else {
      this.setState({ isFetchingData: false });
    }
  }

  handleAddNode(event) {
    // If the form has invalid input set the validation to true so that correct
    // and incorrect input fields can be displayed. If the form has valid inputs
    // save the input
    event.preventDefault();
    if (!this.nodeDataValid()) {
      this.setState({ validated: true });
      event.stopPropagation();
      return;
    }
    // For the event to be used in the => function it must be persisted,
    // otherwise, it would be nullified.
    event.persist();
    this.setState((prevState) => {
      const { nodesConfigJson, currentNodeConfig } = prevState;
      const currentNodeIndex = prevState.currentNodeIndex.toString();
      // If node is not a validator do not store a stash account as it does not
      // make sense
      if (!toBool(currentNodeConfig.node_is_validator)) {
        currentNodeConfig.node_public_key = '';
      }
      // If node is not a data source, the node will not be used as archive
      // source, therefore need to set it to false.
      if (!toBool(currentNodeConfig.use_as_data_source)) {
        currentNodeConfig.is_archive_node = 'false';
      }
      nodesConfigJson[`node_${currentNodeIndex}`] = currentNodeConfig;
      return {
        nodesConfigJson,
        currentNodeConfig: Object.create(
          nodesConfig, Object.getOwnPropertyDescriptors(nodesConfig),
        ),
        currentNodeIndex: prevState.currentNodeIndex + 1,
        validated: false,
      };
    });
  }

  handleRemoveNode(index) {
    this.setState((prevState) => {
      const updatedNodesConfig = prevState.nodesConfigJson;
      delete updatedNodesConfig[`node_${index}`];
      const highestNodeIndex = highestItemIndexInConfig(
        updatedNodesConfig, 'node_',
      );
      return {
        nodesConfigJson: updatedNodesConfig,
        currentNodeIndex: highestNodeIndex + 1,
      };
    });
  }

  nodeNameValid() {
    const { state } = this;
    return !fieldEmpty(state.currentNodeConfig.node_name)
      && fieldValueUniqueAmongAllfieldsInJSON(
        state.nodesConfigJson, 'node_name', state.currentNodeConfig.node_name,
      );
  }

  nodeAPIUrlValid() {
    const { state } = this;
    return !fieldEmpty(state.currentNodeConfig.node_api_url);
  }

  nodeExporterUrlValid() {
    // Node exporter is optional therefore empty or not it is valid.
    const { state } = this;
    return true;
  }

  nodePubKeyValid() {
    const { state } = this;
    // If node is not a validator, the stash field does not apply.
    if (!toBool(state.currentNodeConfig.node_is_validator)) {
      return true;
    }
    // Otherwise it must not be empty.
    return !fieldEmpty(state.currentNodeConfig.node_public_key);
  }

  chainNameValid() {
    const { state } = this;
    return !fieldEmpty(state.currentNodeConfig.chain_name);
  }

  nodeDataValid() {
    return this.nodeNameValid() && this.chainNameValid() && this.nodeAPIUrlValid()
      && this.nodePubKeyValid();
  }

  handleChangeInNonBooleanField(event, field) {
    // For the event to be used in the => function it must be persisted,
    // otherwise, it would be nullified.
    event.persist();
    this.setState((prevState) => {
      const newConfig = prevState.currentNodeConfig;
      newConfig[field] = event.target.value;
      return { currentNodeConfig: newConfig };
    });
  }

  handleChangeInBooleanField(event, field) {
    this.setState((prevState) => {
      const newConfig = prevState.currentNodeConfig;
      newConfig[field] = (!toBool(prevState.currentNodeConfig[field]))
        .toString();
      return { currentNodeConfig: newConfig };
    });
  }

  render() {
    const { state } = this;
    return (
      <Page
        spinnerCondition={state.isFetchingData}
        component={(
          <NodesConfig
            handleAddNode={event => this.handleAddNode(event)}
            handleRemoveNode={index => this.handleRemoveNode(index)}
            currentNodeConfig={state.currentNodeConfig}
            currentNodeIndex={state.currentNodeIndex}
            validated={state.validated}
            nodesConfigJson={state.nodesConfigJson}
            handleChangeInNonBooleanField={
              (event, field) => {
                this.handleChangeInNonBooleanField(event, field);
              }
            }
            handleChangeInBooleanField={
              (event, field) => {
                this.handleChangeInBooleanField(event, field);
              }
            }
            nodeNameValid={() => this.nodeNameValid()}
            chainNameValid={() => this.chainNameValid()}
            nodeAPIUrlValid={() => this.nodeAPIUrlValid()}
            nodePubKeyValid={() => this.nodePubKeyValid()}
            nodeExporterUrlValid={() => this.nodeExporterUrlValid()}
          />
        )}
      />
    );
  }
}

NodesTable.propTypes = forbidExtraProps({
  nodesConfigJson: PropTypes.objectOf(PropTypes.object).isRequired,
  handleRemoveNode: PropTypes.func.isRequired,
});

NodesConfig.propTypes = forbidExtraProps({
  handleAddNode: PropTypes.func.isRequired,
  handleChangeInNonBooleanField: PropTypes.func.isRequired,
  handleChangeInBooleanField: PropTypes.func.isRequired,
  currentNodeConfig: NODE_CONFIG_TYPE.isRequired,
  currentNodeIndex: PropTypes.number.isRequired,
  validated: PropTypes.bool.isRequired,
  nodeNameValid: PropTypes.func.isRequired,
  chainNameValid: PropTypes.func.isRequired,
  nodeAPIUrlValid: PropTypes.func.isRequired,
  nodePubKeyValid: PropTypes.func.isRequired,
  nodeExporterUrlValid: PropTypes.func.isRequired,
  nodesConfigJson: PropTypes.objectOf(PropTypes.object).isRequired,
  handleRemoveNode: PropTypes.func.isRequired,
});

export default NodesSettingsPage;

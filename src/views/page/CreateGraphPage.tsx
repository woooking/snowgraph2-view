import * as React from 'react';
import { ChangeEvent } from 'react';
import { WebsocketProps, withWebSocket } from '../../components/websocket/WebSocketWrapper';
import { CREATE_GRAPH } from '../../config';
import { PluginConfig } from '../../model/PluginConfig';
import { SnowGraph } from '../../model/SnowGraph';
import { post } from '../../util';

interface CreateGraphPageState {
  currentStep: number;
  name: string;
  src: string;
  dest: string;
  plugins: PluginConfig[];
  creatingGraph: boolean;
}

const codeTokenizer = {
  args: [],
  path: 'edu.pku.sei.tsr.snowgraph.codetokenizer.CodeTokenizer',
};

const javaCodeExtractor = {
  args: ['sourcecode'],
  path: 'edu.pku.sei.tsr.snowgraph.javacodeextractor.JavaCodeExtractor',
};

const jiraExtractor = {
  args: ['jira'],
  path: 'edu.pku.sei.tsr.snowgraph.jiraextractor.JiraExtractor',
};

const predefinedPlugins: { [k: string]: PluginConfig } = {
  codeTokenizer, javaCodeExtractor, jiraExtractor
};

class CreateGraphPage extends React.Component<WebsocketProps, CreateGraphPageState> {
  public readonly state: CreateGraphPageState = {
    creatingGraph: false,
    currentStep: 0,
    dest: '/home/woooking/lab/neo4j/databases/snow-graph',
    name: 'nutch',
    plugins: [],
    src: '/home/woooking/lab/nutch',
  };

  public render() {
    const {currentStep} = this.state;
    return (
      <div>
        {currentStep === 0 && <div>
          <h4>Enter Basic Info</h4>
          <form>
            <div>
              <label htmlFor="name">Name: </label>
              <input value="nutch" id="name" type="text" onChange={this.handleChange('name')}/>
            </div>
            <div>
              <label htmlFor="src">Source Directory: </label>
              <input value="/home/woooking/lab/nutch" id="src" type="text" onChange={this.handleChange('src')}/>
            </div>
            <div>
              <label htmlFor="dest">Destination Directory: </label>
              <input value="/home/woooking/lab/neo4j/databases/snow-graph" id="dest" type="text"
                     onChange={this.handleChange('dest')}/>
            </div>
            <div>
              <p>Plugins:</p>
              <ul>
                {this.state.plugins.map(p => <li key={p.path}>{p.path}</li>)}
              </ul>
              {Object.keys(predefinedPlugins).map(k => {
                const p = predefinedPlugins[k];
                return <button
                  key={p.path}
                  disabled={this.state.plugins.indexOf(p) !== -1}
                  type="button"
                  onClick={this.handlePreDefinedPlugin(k)}
                >
                  Add {k}
                </button>;
              })}
            </div>
            <div>
              <button disabled={this.state.creatingGraph} type="button" onClick={this.handleBuildGraph}>
                Build Graph
              </button>
            </div>
          </form>
        </div>
        }

      </div>
    );
  }

  private handlePreDefinedPlugin = (plugin: keyof typeof predefinedPlugins) => () => {
    const p = predefinedPlugins[plugin];
    this.setState(prevState => ({
      plugins: [...prevState.plugins, p]
    }));
  };

  private handleBuildGraph = () => {
    const {name, src, dest, plugins} = this.state;
    const params = {
      destination: dest,
      name,
      pluginConfigs: plugins,
      srcDir: src,
    };
    this.setState({creatingGraph: true});
    post<SnowGraph>(CREATE_GRAPH, params)
      .then(data =>
        this.setState(prevState => ({
          creatingGraph: false,
        })))
      .catch(() => this.setState({creatingGraph: false}));
  };

  private handleChange = (key: 'name' | 'src' | 'dest') => (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [key]: event.target.value
    } as {});
  };
}

export default withWebSocket(CreateGraphPage);

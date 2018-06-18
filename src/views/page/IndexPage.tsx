import * as React from 'react';
import { ChangeEvent } from 'react';
import { CREATE_GRAPH, GET_GRAPHS } from '../../config';
import { PluginConfig } from '../../model/PluginConfig';
import { SnowGraph } from '../../model/SnowGraph';
import { post } from '../../util';

interface IndexPageState {
  graphs: SnowGraph[];
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

class IndexPage extends React.Component<{}, IndexPageState> {
  public readonly state: IndexPageState = {
    creatingGraph: false,
    dest: '/home/woooking/lab/neo4j/databases/snow-graph',
    graphs: [],
    name: 'nutch',
    plugins: [],
    src: '/home/woooking/lab/nutch',
  };

  public componentDidMount() {
    fetch(GET_GRAPHS)
      .then(data => data.json())
      .then((data: SnowGraph[]) => {
        this.setState({
          graphs: data
        });
      });
  }

  public render() {
    const {graphs} = this.state;

    return (
      <div>
        {graphs.map(graph =>
          <div key={graph.destination}>
            <div>
              {graph.name}/{graph.destination}
            </div>
            {graph.pluginConfigs.map(config =>
              <div key={config.path}>
                {config.path}
                {config.args.map((arg, index) => <p key={index}>{arg}</p>)}
              </div>
            )}
          </div>
        )}
        <div>
          <h4>Build New Graph:</h4>
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
          graphs: [...prevState.graphs, data],
        })))
      .catch(() => this.setState({creatingGraph: false}));
  };

  private handleChange = (key: 'name' | 'src' | 'dest') => (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [key]: event.target.value
    } as {});
  };
}

export default IndexPage;

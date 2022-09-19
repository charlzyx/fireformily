import { Tree } from 'antd';
import {
  ExpressionScope,
  RecordScope,
  RecordsScope,
  Observer,
  useExpressionScope,
} from '@formily/react';
import { observable, toJS } from '@formily/reactive';
import { TreeRecordScope } from '../../../pro/TreeDataScope';

import { loadData } from './mock';
import { useEffect, useMemo } from 'react';

const FIELD_NAMES = {
  title: 'label',
  key: 'value',
};

type TreeData = {
  label: string;
  value: string;
  children?: TreeData[];
};

const getChainNodes = (
  treeData: TreeData[],
  target: TreeData,
  chain: any[],
) => {
  treeData.forEach((item) => {
    if (item.value == target.value) {
      chain.unshift(item);
    } else if (item.children) {
      const inMyChild = getChainNodes(item.children, target, chain);
      if (inMyChild.length > 0) {
        chain.unshift(item);
      }
    }
  });
  return chain;
};

const ScopeLogger = () => {
  const scope = useExpressionScope();

  return (
    <div
      onClick={() => {
        console.log('---scope', JSON.parse(JSON.stringify(scope, null, 2)));
        let $lookup = scope.$lookup;
        console.log('$lookup', JSON.parse(JSON.stringify($lookup, null, 2)));
        console.log('$lookup.$lookup', $lookup?.$lookup);
        console.log('$lookup.$lookup.$lookup', $lookup?.$lookup?.$lookup);
      }}
    >
      LOG SCOPE
    </div>
  );
};

const TreeNodeRender = (props: { node: TreeData }) => {
  const { node } = props;

  return (
    <TreeRecordScope<TreeData>
      getNode={() => node}
      getParents={(current, treeRoot) => {
        const withSelf = getChainNodes(treeRoot!, current!, []);
        withSelf.pop();
        console.log(
          'get parent of ',
          current?.value,
          withSelf.map((x) => x.label),
        );
        return withSelf;
      }}
      eq={(a, b) => a.value === b.value}
    >
      <div
        style={{
          paddingLeft: '10px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {node.label}
        {node.value}
        <ScopeLogger />
      </div>
    </TreeRecordScope>
  );
};

const TreeNew = () => {
  const state = useMemo(() => {
    return observable({ tree: [] as any[], loading: false });
  }, []);

  const onLoad = (node: any) => {
    let chain = getChainNodes(state.tree, node, []);
    const last = chain[chain.length - 1];

    state.loading = true;

    last.loading = true;
    return loadData(chain)
      .then((list) => {
        last.loading = false;
        last.children = list;
      })
      .finally(() => {
        last.loading = false;
        state.loading = false;
      });
  };

  useEffect(() => {
    loadData([]).then((list) => {
      state.tree = list;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Observer>
      {() => {
        return (
          <TreeRecordScope getRoot={() => state.tree}>
            <Tree
              titleRender={(node) => {
                return (
                  <TreeNodeRender key={node.pos} node={node}></TreeNodeRender>
                );
              }}
              showLine
              blockNode
              fieldNames={FIELD_NAMES}
              treeData={toJS(state.tree)}
              loadData={onLoad}
            ></Tree>
          </TreeRecordScope>
        );
      }}
    </Observer>
  );
};

export default TreeNew;

// import { Space, Typography } from 'antd';
// import { Linkage, LinkageOption } from 'fireformily';
// import React, { useEffect, useState } from 'react';
// import { flat, getById, remote } from './mock';

// const LoadDataDemo = () => {
//   const [value, setValue] = useState(['140000', '140200', '140214']);

//   useEffect(() => {
//     console.log('--value', value);
//   }, [value]);

//   return (
//     <Linkage
//       loadData={loadData}
//       value={value}
//       onChange={(neo) => setValue(neo as any)}
//     ></Linkage>
//   );
// };

// const LinkageDemo: React.FC = () => {
//   return (
//     <Space direction="vertical">
//       <Space direction="vertical">
//         <Typography.Title level={4}>loadAll</Typography.Title>
//         <LoadAllDemo></LoadAllDemo>
//       </Space>

//       <Space direction="vertical">
//         <Typography.Title level={4}>loadData</Typography.Title>
//         <LoadDataDemo></LoadDataDemo>
//       </Space>
//     </Space>
//   );
// };

// export default LinkageDemo;

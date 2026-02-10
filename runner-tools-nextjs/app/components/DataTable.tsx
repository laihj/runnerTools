'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Table, Select, Input, Button, Row, Col, Spin } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const { Option } = Select;

interface PaceData {
  full: string;
  half: string;
  recovery: string;
  easyslow: string;
  easyfast: string;
  lsd: string;
  tempo: string;
  strenght: string;
  ten: string;
  five: string;
}

interface TrainingPlan {
  week: number;
  schedule: Array<{
    desc: string;
    excisedesc?: string;
    excise: Array<{
      distance: number;
      paceType: string;
    }>;
    warm: boolean;
    cold: boolean;
  }>;
}

interface DataTableProps {
  data: PaceData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [tableData, setTableData] = useState<PaceData[]>(data);
  const [showAll, setShowAll] = useState(true);
  const [selectedDataRow, setSelectedDataRow] = useState<PaceData | null>(null);
  const [selectedPlanData, setSelectedPlanData] = useState<TrainingPlan[]>([]);
  const [warm, setWarm] = useState('1.6');
  const [cold, setCold] = useState('1.6');
  const [loading, setLoading] = useState(false);
  const [planType, setPlanType] = useState('Beginner');
  const [basicPlan, setBasicPlan] = useState<TrainingPlan[]>([]);
  const [advancePlan, setAdvancePlan] = useState<TrainingPlan[]>([]);

  const options = [
    { value: 'basic', label: 'Beginner' },
    { value: 'advance', label: 'Advanced' },
  ];

  useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
    // Load training plans
    Promise.all([
      fetch('/data/basicPlan.json').then(res => res.json()),
      fetch('/data/advancePlan.json').then(res => res.json())
    ]).then(([basic, advance]) => {
      setBasicPlan(basic);
      setAdvancePlan(advance);
      setSelectedPlanData(basic);
    }).catch(error => console.error('Error loading training plans:', error));
  }, []);

  const selectOne = (value: string) => {
    if (value === 'Beginner') {
      setSelectedPlanData(basicPlan);
    } else {
      setSelectedPlanData(advancePlan);
    }
  };

  const rowClick = (record: PaceData) => {
    if (showAll) {
      setTableData([record]);
      setSelectedDataRow(record);
      setShowAll(false);
    } else {
      setTableData(data);
      setSelectedDataRow(null);
      setShowAll(true);
    }
  };

  const secondOfString = useCallback((time: string): number => {
    const timeArray = time.split(':');
    return parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
  }, []);

  const stringOfSecond = useCallback((second: number): string => {
    const hour = Math.floor(second / 3600);
    const minute = Math.floor((second - hour * 3600) / 60);
    const sec = Math.round(second % 60);
    return hour.toString().padStart(2, '0') + ':' + minute.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0');
  }, []);

  const distanceOfDay = useCallback((week: TrainingPlan, day: number, warmUp: string, coolDown: string): number => {
    const runSchedule = week.schedule[day];
    let distance = 0;
    
    if (runSchedule.warm && warmUp.length > 0) {
      distance += parseFloat(warmUp);
    }

    for (const run of runSchedule.excise) {
      distance += run.distance;
    }

    if (runSchedule.cold && coolDown.length > 0) {
      distance += parseFloat(coolDown);
    }
    
    return distance;
  }, []);

  const distanceOfDayString = useCallback((week: TrainingPlan, day: number, warmUp: string, coolDown: string): string => {
    const runSchedule = week.schedule[day];
    let runDistance = '';
    let distance = 0;
    
    if (runSchedule.warm && warmUp.length > 0) {
      runDistance += parseFloat(warmUp).toFixed(1);
      runDistance += '+';
    }

    for (const run of runSchedule.excise) {
      distance += run.distance;
    }
    
    if (distance > 0) {
      runDistance = runDistance + distance.toFixed(1);
    }

    if (runSchedule.cold && coolDown.length > 0) {
      runDistance += '+';
      runDistance += parseFloat(coolDown).toFixed(1);
    }
    
    return runDistance;
  }, []);

  const durationOfDay = useCallback((week: TrainingPlan, day: number, row: PaceData | null, warmUp: string, coolDown: string): string => {
    const runSchedule = week.schedule[day];
    if (!row) return '';

    let slowDuration = 0;
    let fastDuration = 0;

    for (const run of runSchedule.excise) {
      const distance = run.distance;
      const type = run.paceType;
      let slowSecond = 0;
      let fastSecond = 0;

      if (type === 'speed') {
        fastSecond = secondOfString(row.five);
        slowSecond = secondOfString(row.ten);
      } else if (type === 'easy') {
        slowSecond = secondOfString(row.easyslow);
        fastSecond = secondOfString(row.easyfast);
      } else if (type === 'recover') {
        slowSecond = secondOfString(row.recovery);
        fastSecond = secondOfString(row.recovery);
      } else if (type === 'lsd') {
        slowSecond = secondOfString(row.lsd);
        fastSecond = secondOfString(row.lsd);
      } else if (type === 'strenght') {
        slowSecond = secondOfString(row.strenght);
        fastSecond = secondOfString(row.strenght);
      } else if (type === 'tempo') {
        slowSecond = secondOfString(row.tempo);
        fastSecond = secondOfString(row.tempo);
      }

      slowDuration += distance * slowSecond;
      fastDuration += distance * fastSecond;
    }

    const easySlowSecond = secondOfString(row.easyslow);
    const easyFastSecond = secondOfString(row.easyfast);

    if (runSchedule.warm && warmUp.length > 0) {
      slowDuration += parseFloat(warmUp) * easySlowSecond;
      fastDuration += parseFloat(warmUp) * easyFastSecond;
    }

    if (runSchedule.cold && coolDown.length > 0) {
      slowDuration += parseFloat(coolDown) * easySlowSecond;
      fastDuration += parseFloat(coolDown) * easyFastSecond;
    }

    if (fastDuration === 0) return '';

    if (slowDuration === fastDuration) {
      return stringOfSecond(fastDuration);
    } else {
      return stringOfSecond(fastDuration) + '-' + stringOfSecond(slowDuration);
    }
  }, [secondOfString, stringOfSecond]);

  const exciseDiscriptionOfDay = useCallback((week: TrainingPlan, day: number): string => {
    return week.schedule[day].excisedesc || '';
  }, []);

  const descriptionOfWeekDay = useCallback((week: TrainingPlan, day: number): React.ReactNode => {
    const description = week.schedule[day].desc;
    const exciseDesc = exciseDiscriptionOfDay(week, day);
    const distance = distanceOfDayString(week, day, warm, cold);
    const duration = durationOfDay(week, day, selectedDataRow, warm, cold);

    return (
      <div>
        <div>{description}</div>
        {exciseDesc && <div>{exciseDesc}</div>}
        {distance.length > 0 && <div>{distance} KM</div>}
        {duration.length > 0 && <div className="duration-text">{duration}</div>}
      </div>
    );
  }, [exciseDiscriptionOfDay, distanceOfDayString, durationOfDay, warm, cold, selectedDataRow]);

  const distanceOfWeek = useCallback((week: TrainingPlan): string => {
    let distance = 0;
    for (let i = 0; i < week.schedule.length; i++) {
      const distanceDay = distanceOfDay(week, i, warm, cold);
      distance += distanceDay;
    }
    return distance.toFixed(1);
  }, [distanceOfDay, warm, cold]);

  const handlePrint = async () => {
    window.pageYOffset = 100;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    setLoading(true);

    try {
      const canvas = await html2canvas(document.querySelector('#printplan') as HTMLElement, {
        allowTaint: true,
        useCORS: true,
      });

      const contentWidth = canvas.width;
      const contentHeight = canvas.height;
      const pageHeight = (contentWidth / 592.28) * 841.89;
      let leftHeight = contentHeight;
      let position = 0;
      const imgWidth = 595.28;
      const imgHeight = (592.28 / contentWidth) * contentHeight;
      const pageData = canvas.toDataURL('image/jpeg', 1.0);
      const PDF = new jsPDF('', 'pt', 'a4');

      if (leftHeight < pageHeight) {
        PDF.addImage(pageData, 'JPEG', 0, 50, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          if (leftHeight > 0) {
            PDF.addPage();
          }
        }
      }

      PDF.save('plan.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const paceColumns = [
    { title: 'Full Marathon', dataIndex: 'full', key: 'full' },
    { title: 'Half Marathon', dataIndex: 'half', key: 'half' },
    { title: 'Rest', dataIndex: 'recovery', key: 'recovery' },
    { title: 'Easy slow', dataIndex: 'easyslow', key: 'easyslow' },
    { title: 'Easy fast', dataIndex: 'easyfast', key: 'easyfast' },
    { title: 'LSD', dataIndex: 'lsd', key: 'lsd' },
    { title: 'MP', dataIndex: 'tempo', key: 'tempo' },
    { title: '@MP-10', dataIndex: 'strenght', key: 'strenght' },
    { title: '10 KM', dataIndex: 'ten', key: 'ten' },
    { title: '5 KM', dataIndex: 'five', key: 'five' },
  ];

  const planColumns = [
    { title: 'Week', dataIndex: 'week', key: 'week', width: 100 },
    { title: 'Monday', key: 'monday', render: (record: TrainingPlan) => descriptionOfWeekDay(record, 0) },
    { title: 'Tuesday', key: 'tuesday', render: (record: TrainingPlan) => descriptionOfWeekDay(record, 1) },
    { title: 'Wednesday', key: 'wednesday', render: (record: TrainingPlan) => descriptionOfWeekDay(record, 2) },
    { title: 'Thursday', key: 'thursday', render: (record: TrainingPlan) => descriptionOfWeekDay(record, 3) },
    { title: 'Friday', key: 'friday', render: (record: TrainingPlan) => descriptionOfWeekDay(record, 4) },
    { title: 'Saturday', key: 'saturday', render: (record: TrainingPlan) => descriptionOfWeekDay(record, 5) },
    { title: 'Sunday', key: 'sunday', render: (record: TrainingPlan) => descriptionOfWeekDay(record, 6) },
    { title: 'Weekly Mileage', key: 'mileage', width: 200, render: (record: TrainingPlan) => distanceOfWeek(record) },
  ];

  return (
    <div id="printplan" className="w-full p-5">
      <div className="w-full max-w-7xl mx-auto">
        <div id="pace" className="mb-8">
          <Table
            dataSource={tableData.map((item, index) => ({ ...item, key: index }))}
            columns={paceColumns}
            pagination={false}
            bordered
            size="middle"
            rowClassName="cursor-pointer"
            onRow={(record) => ({
              onClick: () => rowClick(record),
            })}
            className="mb-4"
          />
        </div>

        {!showAll && (
          <div id="plan">
            <div className="controls-row mb-6">
              <Row gutter={40} align="middle">
                <Col span={6}>
                  <Select
                    value={planType}
                    onChange={(value) => {
                      setPlanType(value);
                      selectOne(value);
                    }}
                    size="large"
                    className="w-full"
                  >
                    {options.map(option => (
                      <Option key={option.value} value={option.label}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={6}>
                  <div className="input-group">
                    <label>Warm up</label>
                    <Input
                      value={warm}
                      onChange={(e) => setWarm(e.target.value)}
                      placeholder="Warm up"
                    />
                  </div>
                </Col>
                <Col span={6}>
                  <div className="input-group">
                    <label>Cool down</label>
                    <Input
                      value={cold}
                      onChange={(e) => setCold(e.target.value)}
                      placeholder="Cool down"
                    />
                  </div>
                </Col>
              </Row>
            </div>

            <div id="planTable">
              <Spin spinning={loading}>
                <Table
                  dataSource={selectedPlanData.map((item, index) => ({ ...item, key: index }))}
                  columns={planColumns}
                  pagination={false}
                  bordered
                  size="middle"
                  scroll={{ x: 'max-content' }}
                />
              </Spin>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Button type="primary" size="large" onClick={handlePrint}>
            Get PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
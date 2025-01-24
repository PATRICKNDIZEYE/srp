import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactApexChart from 'react-apexcharts';

const ReportCharts = () => {
  const { t } = useTranslation();

  // Progress by Intervention Area Chart
  const progressChart = {
    series: [
      {
        name: 'Target Reached',
        data: [85, 75, 90, 65, 80],
      },
      {
        name: 'Budget Utilized',
        data: [80, 70, 85, 60, 75],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: ['Community Healing', 'Social Reintegration', 'Social Cohesion', 'Education', 'Healthcare'],
      },
      yaxis: {
        title: {
          text: 'Percentage (%)',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + "%";
          },
        },
      },
      theme: {
        mode: 'light',
      },
    },
  };

  // Gender Distribution Chart
  const genderChart = {
    series: [44, 55, 1],
    options: {
      chart: {
        type: 'donut',
      },
      labels: ['Male', 'Female', 'Other'],
      colors: ['#3C50E0', '#10B981', '#F59E0B'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  };

  // Monthly Progress Trend
  const trendChart = {
    series: [{
      name: 'Progress',
      data: [65, 70, 75, 80, 85, 90]
    }],
    options: {
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      },
      yaxis: {
        title: {
          text: 'Completion Rate (%)',
        },
      },
      markers: {
        size: 4,
        colors: ['#3C50E0'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
        },
      },
      grid: {
        borderColor: '#e0e0e0',
      },
    },
  };

  // Budget Distribution
  const budgetChart = {
    series: [
      {
        name: 'Budget Allocation',
        data: [30, 25, 20, 15, 10],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val + "%";
        },
      },
      xaxis: {
        categories: ['Program Activities', 'Staff & Training', 'Equipment', 'Transportation', 'Other'],
      },
      colors: ['#10B981'],
    },
  };

  return (
    <>
      {/* Progress by Intervention Area */}
      <div className="col-span-2 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="mb-3 justify-between gap-4 sm:flex">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            {t('Progress by Intervention Area')}
          </h3>
        </div>
        <div className="mb-2">
          <ReactApexChart
            options={progressChart.options}
            series={progressChart.series}
            type="bar"
            height={350}
          />
        </div>
      </div>

      {/* Monthly Progress Trend */}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="mb-3 justify-between gap-4 sm:flex">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            {t('Monthly Progress Trend')}
          </h3>
        </div>
        <div className="mb-2">
          <ReactApexChart
            options={trendChart.options}
            series={trendChart.series}
            type="line"
            height={350}
          />
        </div>
      </div>

      {/* Gender Distribution */}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="mb-3 justify-between gap-4 sm:flex">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            {t('Gender Distribution')}
          </h3>
        </div>
        <div className="mb-2">
          <ReactApexChart
            options={genderChart.options}
            series={genderChart.series}
            type="donut"
            height={350}
          />
        </div>
      </div>

      {/* Budget Distribution */}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="mb-3 justify-between gap-4 sm:flex">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            {t('Budget Distribution')}
          </h3>
        </div>
        <div className="mb-2">
          <ReactApexChart
            options={budgetChart.options}
            series={budgetChart.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </>
  );
};

export default ReportCharts; 
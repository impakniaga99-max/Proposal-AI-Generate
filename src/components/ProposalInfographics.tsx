import React from 'react';
import type { GeneratedModule, Language } from '../types/proposal';
import { formatRM } from '../lib/proposalUtils';

interface SnapshotStripProps {
  language: Language;
  days: number;
  participants: number;
  venue: string;
  totalBudget: number;
}

export const ExecutiveSnapshotStrip: React.FC<SnapshotStripProps> = ({
  language,
  days,
  participants,
  venue,
  totalBudget,
}) => {
  const isEn = language === 'english';
  const items = [
    {
      label: isEn ? 'DURATION' : 'TEMPOH',
      value: `${days} ${isEn ? (days > 1 ? 'Days' : 'Day') : 'Hari'}`,
    },
    {
      label: isEn ? 'PARTICIPANTS' : 'PESERTA',
      value: `${participants} ${isEn ? 'Pax' : 'Orang'}`,
    },
    {
      label: isEn ? 'VENUE' : 'LOKASI',
      value: venue,
    },
    {
      label: isEn ? 'EST. INVESTMENT' : 'ANGGARAN BAJET',
      value: formatRM(totalBudget),
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        backgroundColor: '#f8fafc',
        marginBottom: '14px',
        overflow: 'hidden',
      }}
    >
      {items.map((item, idx) => (
        <div
          key={item.label}
          style={{
            padding: '8px 10px',
            borderRight: idx < 3 ? '1px solid #cbd5e1' : 'none',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '7pt',
              fontWeight: 700,
              color: '#64748b',
              letterSpacing: '0.06em',
              lineHeight: 1.35,
              marginBottom: '2px',
            }}
          >
            {item.label}
          </div>
          <div
            className="num-cell"
            style={{
              fontSize: '9.5pt',
              fontWeight: 700,
              color: '#002147',
              lineHeight: 1.35,
            }}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
};

interface BlendedLearningInfographicProps {
  language: Language;
}

export const BlendedLearningInfographic: React.FC<BlendedLearningInfographicProps> = ({
  language,
}) => {
  const isEn = language === 'english';
  const steps = isEn
    ? [
        { num: '01', title: 'Concept & Framework', ratio: '30%' },
        { num: '02', title: 'Case Simulation', ratio: '30%' },
        { num: '03', title: 'Group Workshop', ratio: '25%' },
        { num: '04', title: 'Action Plan', ratio: '15%' },
      ]
    : [
        { num: '01', title: 'Konsep & Kerangka', ratio: '30%' },
        { num: '02', title: 'Simulasi Kajian Kes', ratio: '30%' },
        { num: '03', title: 'Bengkel Berkumpulan', ratio: '25%' },
        { num: '04', title: 'Pelan Tindakan', ratio: '15%' },
      ];

  return (
    <div
      style={{
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        padding: '10px 12px',
        backgroundColor: '#f8fafc',
      }}
    >
      <div
        style={{
          fontSize: '8pt',
          fontWeight: 700,
          color: '#002147',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          lineHeight: 1.35,
          marginBottom: '8px',
        }}
      >
        {isEn ? 'Blended Learning Framework' : 'Kerangka Pembelajaran Bersepadu'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {steps.map((step, idx) => (
          <div
            key={step.num}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              padding: '5px 8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span
                className="num-cell"
                style={{
                  fontSize: '7.5pt',
                  fontWeight: 700,
                  color: '#ffffff',
                  backgroundColor: idx % 2 === 0 ? '#002147' : '#b08d26',
                  borderRadius: '3px',
                  padding: '2px 5px',
                  lineHeight: 1.25,
                }}
              >
                {step.num}
              </span>
              <span style={{ fontSize: '8.5pt', fontWeight: 600, color: '#1e293b', lineHeight: 1.3 }}>
                {step.title}
              </span>
            </div>
            <span
              className="num-cell"
              style={{ fontSize: '8pt', fontWeight: 700, color: '#002147', lineHeight: 1.3 }}
            >
              {step.ratio}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ModuleRoadmapInfographicProps {
  language: Language;
  modules: GeneratedModule[];
}

export const ModuleRoadmapInfographic: React.FC<ModuleRoadmapInfographicProps> = ({
  language,
  modules,
}) => {
  const isEn = language === 'english';
  return (
    <div
      style={{
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        padding: '10px 12px',
        backgroundColor: '#f8fafc',
        marginBottom: '12px',
      }}
    >
      <div
        style={{
          fontSize: '8pt',
          fontWeight: 700,
          color: '#002147',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          lineHeight: 1.35,
          marginBottom: '8px',
        }}
      >
        {isEn ? '4-Phase Competency Progression' : 'Peta Progresif 4 Fasa Modul'}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          alignItems: 'stretch',
        }}
      >
        {modules.slice(0, 4).map((mod, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderTop: `3px solid ${idx % 2 === 0 ? '#002147' : '#D4AF37'}`,
              borderRadius: '4px',
              padding: '7px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
            }}
          >
            <div
              className="num-cell"
              style={{
                fontSize: '7pt',
                fontWeight: 700,
                color: '#b08d26',
                textTransform: 'uppercase',
                lineHeight: 1.3,
              }}
            >
              {isEn ? `Module 0${idx + 1}` : `Modul 0${idx + 1}`}
            </div>
            <div
              style={{
                fontSize: '8pt',
                fontWeight: 700,
                color: '#002147',
                lineHeight: 1.3,
              }}
            >
              {mod.namaModul}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface BudgetDonutInfographicProps {
  language: Language;
  speakerFee: number;
  packageCost: number;
  contingency: number;
  totalBudget: number;
}

export const BudgetDonutInfographic: React.FC<BudgetDonutInfographicProps> = ({
  language,
  speakerFee,
  packageCost,
  contingency,
  totalBudget,
}) => {
  const isEn = language === 'english';
  const safeSpeaker = Math.max(0, speakerFee);
  const safePackage = Math.max(0, packageCost);
  const safeContingency = Math.max(0, contingency);
  const sum = safeSpeaker + safePackage + safeContingency || 1;

  const pctSpeaker = Math.round((safeSpeaker / sum) * 100);
  const pctPackage =
    safeContingency > 0 ? Math.round((safePackage / sum) * 100) : Math.max(0, 100 - pctSpeaker);
  const pctContingency =
    safeContingency > 0 ? Math.max(0, 100 - pctSpeaker - pctPackage) : 0;

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const lenSpeaker = (pctSpeaker / 100) * circumference;
  const lenPackage = (pctPackage / 100) * circumference;
  const lenContingency = (pctContingency / 100) * circumference;

  const segments = [
    {
      label: isEn ? 'Speaker / Facilitator Fee' : 'Fee Penceramah',
      amount: speakerFee,
      pct: pctSpeaker,
      color: '#002147',
    },
    {
      label: isEn ? 'Training Package & Logistics' : 'Pakej Latihan & Logistik',
      amount: packageCost,
      pct: pctPackage,
      color: '#D4AF37',
    },
    ...(safeContingency > 0
      ? [
          {
            label: isEn ? 'Contingency (10%)' : 'Kontigensi (10%)',
            amount: contingency,
            pct: pctContingency,
            color: '#64748b',
          },
        ]
      : []),
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '115px 1fr',
        gap: '16px',
        alignItems: 'center',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        padding: '10px 14px',
        backgroundColor: '#f8fafc',
        marginBottom: '12px',
      }}
    >
      {/* Pure SVG Donut Chart */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="14" />
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="#002147"
            strokeWidth="14"
            strokeDasharray={`${lenSpeaker} ${circumference}`}
            strokeDashoffset={0}
            transform="rotate(-90 48 48)"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="#D4AF37"
            strokeWidth="14"
            strokeDasharray={`${lenPackage} ${circumference}`}
            strokeDashoffset={-lenSpeaker}
            transform="rotate(-90 48 48)"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="#64748b"
            strokeWidth="14"
            strokeDasharray={`${lenContingency} ${circumference}`}
            strokeDashoffset={-(lenSpeaker + lenPackage)}
            transform="rotate(-90 48 48)"
          />
          <text
            x="48"
            y="46"
            textAnchor="middle"
            fill="#002147"
            fontSize="8.5"
            fontWeight="700"
            fontFamily="Arial, Helvetica, sans-serif"
          >
            100%
          </text>
          <text
            x="48"
            y="56"
            textAnchor="middle"
            fill="#64748b"
            fontSize="6"
            fontFamily="Arial, Helvetica, sans-serif"
          >
            {isEn ? 'ALLOCATION' : 'AGIHAN'}
          </text>
        </svg>
      </div>

      {/* Legend & Bar Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            borderBottom: '1px solid #cbd5e1',
            paddingBottom: '4px',
          }}
        >
          <span
            style={{
              fontSize: '8pt',
              fontWeight: 700,
              color: '#002147',
              textTransform: 'uppercase',
            }}
          >
            {isEn ? 'Financial Allocation Breakdown' : 'Infografik Agihan Perbelanjaan'}
          </span>
          <span className="num-cell" style={{ fontSize: '8.5pt', fontWeight: 700, color: '#002147' }}>
            {formatRM(totalBudget)}
          </span>
        </div>

        {segments.map((seg) => (
          <div
            key={seg.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '8.2pt',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '2px',
                  backgroundColor: seg.color,
                  display: 'inline-block',
                }}
              />
              <span style={{ color: '#1e293b', fontWeight: 500 }}>{seg.label}</span>
            </div>
            <div className="num-cell" style={{ color: '#0f172a', fontWeight: 600 }}>
              {seg.pct}% ({formatRM(seg.amount)})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

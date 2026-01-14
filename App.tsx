
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { KNOWLEDGE_BASE, CLASSIC_HATS, PAIN_POINTS, FACE_TYPES, SCENARIOS } from './constants';
import { SecondaryPoint, GeneratedTopic, ImageDemand, HatType } from './types';
import { generateTopicLogic, generateImageDemands } from './services/geminiService';

type GenderCategory = 'universal' | 'male' | 'female';

interface Project {
  id: string;
  topic: GeneratedTopic;
  images: ImageDemand[];
  cardCount: number;
  timestamp: number;
}

const STORAGE_KEY = 'hat_aesthetic_projects';

// 扩展 window 类型
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    // Fix: Remove readonly to avoid modifier mismatch error during interface merging
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [selectedPoints, setSelectedPoints] = useState<SecondaryPoint[]>([]);
  const [selectedHats, setSelectedHats] = useState<HatType[]>([]);
  const [displayHats, setDisplayHats] = useState<HatType[]>([]);
  const [selectedPainPoint, setSelectedPainPoint] = useState<string>("");
  const [customPainPoint, setCustomPainPoint] = useState<string>("");
  
  const [gender, setGender] = useState<GenderCategory>('universal');
  const [faceType, setFaceType] = useState<string>(""); 
  const [scenario, setScenario] = useState<string>(""); 
  const [displayPainPoints, setDisplayPainPoints] = useState<string[]>([]);

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'board' | 'generator'>('board');
  const [isRefreshingPain, setIsRefreshingPain] = useState(false);
  const [isRefreshingHats, setIsRefreshingHats] = useState(false);

  const currentProject = useMemo(() => 
    projects.find(p => p.id === activeProjectId) || null
  , [projects, activeProjectId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    handleSwitchHats();
    handleSwitchPainPoints('universal');
  }, []);

  useEffect(() => {
    if (currentProject) {
      setTempTitle(currentProject.topic.title);
      setIsEditingTitle(false);
    }
  }, [activeProjectId]);

  const handleSwitchHats = () => {
    setIsRefreshingHats(true);
    setTimeout(() => {
      const shuffled = [...CLASSIC_HATS].sort(() => 0.5 - Math.random());
      setDisplayHats(shuffled.slice(0, 8));
      setIsRefreshingHats(false);
    }, 300);
  };

  const handleSwitchPainPoints = (cat: GenderCategory = gender) => {
    setIsRefreshingPain(true);
    setTimeout(() => {
      const pool = PAIN_POINTS[cat];
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      setDisplayPainPoints(shuffled.slice(0, 8));
      setIsRefreshingPain(false);
    }, 300);
  };

  const onGenderChange = (cat: GenderCategory) => {
    setGender(cat);
    setSelectedPainPoint("");
    handleSwitchPainPoints(cat);
  };

  const ensureApiKey = async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }
    }
    return true;
  };

  const handleGenerateFullFlow = useCallback(async () => {
    const finalPainPoint = customPainPoint || selectedPainPoint;
    setIsLoading(true);
    try {
      await ensureApiKey();
      
      const topic = await generateTopicLogic(selectedPoints, selectedHats, {
        painPoint: finalPainPoint,
        gender: gender === 'male' ? '男士' : gender === 'female' ? '女士' : '通用人群',
        faceType: faceType || undefined,
        scenario: scenario || undefined
      });
      
      const demands = await generateImageDemands(topic, 12);

      const newProject: Project = {
        id: Date.now().toString(),
        topic: topic,
        images: demands,
        cardCount: 12,
        timestamp: Date.now()
      };

      setProjects(prev => [newProject, ...prev]);
      setActiveProjectId(newProject.id);
      setActiveTab('board');
    } catch (error: any) {
      console.error("Generate Error:", error);
      const errorMsg = error.message || "";
      
      // 捕获 API Key 泄露或权限错误
      if (errorMsg.includes("leaked") || errorMsg.includes("PERMISSION_DENIED") || errorMsg.includes("Requested entity was not found")) {
        alert("检测到当前的 API Key 已失效或被泄露。请在接下来的弹窗中重新选择一个有效的 API Key（需来自已开启账单的项目）。");
        if (window.aistudio) {
          await window.aistudio.openSelectKey();
        }
      } else {
        alert(`生成失败: ${errorMsg || "未知网络错误"}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedPoints, selectedHats, selectedPainPoint, customPainPoint, gender, faceType, scenario]);

  const handleUpdateCardCount = useCallback(async (count: number) => {
    if (!currentProject) return;
    setIsLoading(true);
    try {
      await ensureApiKey();
      const demands = await generateImageDemands(currentProject.topic, count);
      setProjects(prev => prev.map(p => p.id === currentProject.id ? { 
        ...p, 
        images: demands, 
        cardCount: count 
      } : p));
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.message || "";
      if (errorMsg.includes("leaked") || errorMsg.includes("PERMISSION_DENIED")) {
        alert("API Key 已失效，请重新选择。");
        if (window.aistudio) window.aistudio.openSelectKey();
      } else {
        alert(`更新资产流失败: ${errorMsg}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentProject]);

  const handleSaveProject = () => {
    if (!currentProject) return;
    setProjects(prev => prev.map(p => p.id === currentProject.id ? {
      ...p,
      topic: { ...p.topic, title: tempTitle }
    } : p));
    setIsEditingTitle(false);
    const btn = document.getElementById('save-btn');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = '已保存 ✓';
      setTimeout(() => btn.innerHTML = originalText, 2000);
    }
  };

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("确定要删除这条选题记录吗？")) {
      setProjects(prev => prev.filter(p => p.id !== id));
      if (activeProjectId === id) {
        setActiveProjectId(null);
      }
    }
  };

  const togglePoint = (point: SecondaryPoint) => {
    setSelectedPoints(prev => {
      const exists = prev.find(p => p.id === point.id);
      if (exists) return prev.filter(p => p.id !== point.id);
      return [...prev, point].slice(0, 5);
    });
  };

  const toggleHat = (hat: HatType) => {
    setSelectedHats(prev => {
      const exists = prev.find(h => h.id === hat.id);
      if (exists) return prev.filter(h => h.id !== hat.id);
      return [...prev, hat].slice(0, 3);
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900 font-['Inter','Noto_Sans_SC']">
      {/* Sidebar */}
      <aside className="w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col max-h-screen sticky top-0 z-20 shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-900 text-white">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            帽子美学选题大师
          </h1>
          <p className="text-[10px] text-slate-400 mt-2 font-light uppercase tracking-[0.2em]">Professional Aesthetic Hub</p>
        </div>

        <div className="flex-1 overflow-y-auto knowledge-scroll p-4 space-y-8">
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest px-1">
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
              所有历史记录
            </h3>
            {projects.length > 0 ? (
              <div className="space-y-1.5">
                {projects.map(p => (
                  <div key={p.id} className="group relative">
                    <button
                      onClick={() => { setActiveProjectId(p.id); setActiveTab('board'); }}
                      className={`w-full text-left p-4 pr-10 rounded-xl border transition-all ${
                        activeProjectId === p.id 
                          ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200 shadow-sm' 
                          : 'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className={`text-xs font-black leading-tight truncate ${activeProjectId === p.id ? 'text-indigo-700' : 'text-slate-800'}`}>
                        {p.topic.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-2 flex justify-between items-center font-medium">
                        <span className="bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">{p.topic.tags[0]}</span>
                        <span>{new Date(p.timestamp).toLocaleDateString()}</span>
                      </div>
                    </button>
                    <button 
                      onClick={(e) => handleDeleteProject(e, p.id)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">暂无记录</p>
              </div>
            )}
          </section>

          <div className="h-[1px] bg-slate-100"></div>

          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-indigo-600 flex items-center gap-2 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                结构帽型库
              </h3>
              <button onClick={handleSwitchHats} className="text-[10px] text-slate-400 hover:text-indigo-600 flex items-center gap-1 group">
                <svg className={`w-3 h-3 transition-transform ${isRefreshingHats ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                换一批
              </button>
            </div>
            <div className={`grid grid-cols-2 gap-2 transition-opacity ${isRefreshingHats ? 'opacity-30' : 'opacity-100'}`}>
              {displayHats.map(hat => (
                <button
                  key={hat.id}
                  onClick={() => toggleHat(hat)}
                  className={`text-left p-3 rounded-xl border text-xs transition-all h-20 flex flex-col justify-between ${
                    selectedHats.find(h => h.id === hat.id)
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-200'
                  }`}
                >
                  <div className="font-bold truncate">{hat.name}</div>
                  <div className="text-[9px] opacity-60 uppercase font-medium">{hat.enName}</div>
                </button>
              ))}
            </div>
          </section>

          <div className="h-[1px] bg-slate-100"></div>

          <section className="space-y-6">
            <h3 className="text-xs font-bold text-slate-500 flex items-center gap-2 uppercase tracking-widest px-1">
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
              修饰逻辑参考
            </h3>
            {KNOWLEDGE_BASE.map(primary => (
              <div key={primary.id} className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-400 pl-1">{primary.name}</h4>
                <div className="space-y-2 pl-1">
                  {primary.points.map(secondary => (
                    <button
                      key={secondary.id}
                      onClick={() => togglePoint(secondary)}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                        selectedPoints.find(p => p.id === secondary.id)
                          ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold">{secondary.name}</div>
                      <div className={`text-[10px] mt-0.5 ${selectedPoints.find(p => p.id === secondary.id) ? 'text-slate-400' : 'text-slate-500'}`}>{secondary.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>

        <div className="p-6 bg-white border-t border-slate-100">
          <button
            onClick={() => { setActiveTab('generator'); setActiveProjectId(null); }}
            className="w-full py-4 rounded-2xl font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            开始生成新选题
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen bg-white">
        <nav className="bg-white/95 backdrop-blur border-b border-slate-100 p-4 sticky top-0 z-30 flex justify-between items-center shadow-sm">
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => { setActiveTab('board'); setActiveProjectId(null); }}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${
                activeTab === 'board' ? 'bg-white text-indigo-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              内容资产看板
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${
                activeTab === 'generator' ? 'bg-white text-indigo-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              生成新选题
            </button>
          </div>
          
          <div className="flex-1 flex justify-end">
            {currentProject && (
              <div className="flex items-center gap-3 bg-indigo-50/50 px-4 py-2 rounded-full border border-indigo-100 max-w-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse flex-shrink-0"></span>
                <span className="text-[11px] font-black text-slate-800 truncate">{currentProject.topic.title}</span>
              </div>
            )}
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto p-6 md:p-12 max-w-7xl mx-auto w-full">
          {activeTab === 'generator' ? (
            <div className="max-w-4xl mx-auto space-y-12 py-10 fade-in text-center">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  发现最适合你的<span className="text-indigo-600">美学帽型</span>
                </h2>
                <p className="text-slate-500 text-lg font-medium">从底层原理出发，一键规划视觉资产流，让专业审美落地。</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">1. 目标性别</label>
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    {(['universal', 'female', 'male'] as GenderCategory[]).map(cat => (
                      <button
                        key={cat}
                        onClick={() => onGenderChange(cat)}
                        className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                          gender === cat ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {cat === 'universal' ? '通用' : cat === 'male' ? '男士' : '女士'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">2. 面部特征 (可选)</label>
                  <select 
                    value={faceType}
                    onChange={(e) => setFaceType(e.target.value)}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-black focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all appearance-none"
                  >
                    <option value="">不指定 (Unspecified)</option>
                    {FACE_TYPES.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">3. 生活场景 (可选)</label>
                  <select 
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-black focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all appearance-none"
                  >
                    <option value="">不指定 (Unspecified)</option>
                    {SCENARIOS.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-white p-8 md:p-12 rounded-[3rem] border-2 border-slate-900 shadow-[20px_20px_0px_0px_rgba(15,23,42,1)] space-y-10 text-left relative overflow-hidden">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-black text-slate-900 uppercase tracking-widest">4. 现在的视觉困扰</label>
                    <button onClick={() => handleSwitchPainPoints()} className="text-[11px] font-black text-indigo-600 flex items-center gap-2 hover:bg-indigo-50 px-3 py-1.5 rounded-full transition-colors">
                      <svg className={`w-4 h-4 ${isRefreshingPain ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      换一换
                    </button>
                  </div>
                  <div className={`flex flex-wrap gap-2.5 transition-all duration-300 ${isRefreshingPain ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}`}>
                    {displayPainPoints.map(point => (
                      <button
                        key={point}
                        onClick={() => { setSelectedPainPoint(point); setCustomPainPoint(""); }}
                        className={`px-5 py-2.5 rounded-xl text-sm font-black border-2 transition-all ${
                          selectedPainPoint === point 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg translate-y-[-2px]' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {point}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative group">
                  <input
                    type="text"
                    placeholder="输入更具体的困扰：如太阳穴凹陷、中庭长..."
                    className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-slate-900 transition-all text-sm font-black shadow-inner group-hover:border-slate-200"
                    value={customPainPoint}
                    onChange={(e) => { setCustomPainPoint(e.target.value); setSelectedPainPoint(""); }}
                  />
                </div>

                <button
                  onClick={handleGenerateFullFlow}
                  disabled={isLoading}
                  className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-black transition-all shadow-xl active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-4"
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>正在构建美学资产流...</span>
                    </>
                  ) : '生成深度方案并进入看板'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-12 pb-20 fade-in">
              {!activeProjectId ? (
                <div className="space-y-10">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <h2 className="text-4xl font-black text-slate-900 tracking-tight">内容资产工作台</h2>
                      <p className="text-slate-400 font-medium">已保存的专业选题看板，点击进入深度编辑与查看。</p>
                    </div>
                    {projects.length > 0 && (
                      <button 
                        onClick={() => setActiveTab('generator')}
                        className="px-6 py-2.5 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                      >
                        + 新建选题
                      </button>
                    )}
                  </div>

                  {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {projects.map(p => (
                        <div 
                          key={p.id}
                          onClick={() => setActiveProjectId(p.id)}
                          className="group relative bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 hover:border-indigo-400 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] transition-all cursor-pointer flex flex-col h-64 overflow-hidden"
                        >
                          <div className="flex-1 space-y-4">
                            <div className="flex gap-2">
                              {p.topic.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="px-2.5 py-1 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-wider rounded-lg">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                              {p.topic.title}
                            </h3>
                          </div>
                          <div className="pt-6 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-300">
                             <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                               {p.cardCount} 张资产卡片
                             </div>
                             <span>{new Date(p.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-32 space-y-10 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[4rem] fade-in mx-auto max-w-3xl">
                      <div className="mx-auto w-32 h-32 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center text-slate-200 shadow-sm relative">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-3xl font-black text-slate-900">暂无内容资产看板</h3>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto">尚未生成任何选题方案。请先前往生成页面，输入你的面部困扰，我们将为你一键规划整套视觉资产。</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('generator')}
                        className="px-12 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95 group flex items-center gap-3 mx-auto"
                      >
                        <span>立即开始美学选题</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-12">
                   <button 
                    onClick={() => setActiveProjectId(null)}
                    className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-black text-xs uppercase tracking-widest"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                     </svg>
                     返回看板列表
                   </button>

                   <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 border-b-4 border-slate-900 pb-10">
                    <div className="space-y-6 max-w-3xl flex-1">
                      <div className="flex flex-wrap gap-2">
                        {currentProject.topic.tags.map(t => (
                          <span key={t} className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-indigo-200">
                            {t}
                          </span>
                        ))}
                      </div>
                      
                      {isEditingTitle ? (
                        <div className="flex items-center gap-4">
                          <input 
                            type="text"
                            className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter border-b-4 border-indigo-500 outline-none w-full bg-transparent"
                            value={tempTitle}
                            autoFocus
                            onChange={(e) => setTempTitle(e.target.value)}
                            onBlur={() => setIsEditingTitle(false)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveProject()}
                          />
                        </div>
                      ) : (
                        <h2 
                          onClick={() => setIsEditingTitle(true)}
                          className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter cursor-pointer hover:text-indigo-600 transition-colors group relative inline-block"
                        >
                          {currentProject.topic.title}
                          <svg className="w-6 h-6 absolute -right-10 top-2 opacity-0 group-hover:opacity-30 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </h2>
                      )}
                    </div>

                    <div className="flex flex-col gap-4 items-end">
                      <button 
                        id="save-btn"
                        onClick={handleSaveProject}
                        className="px-10 py-3.5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-[0_15px_30px_rgba(79,70,229,0.3)] active:scale-95 flex items-center gap-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        保存方案
                      </button>

                      <div className="flex bg-slate-900 p-2 rounded-2xl shadow-2xl">
                        {[10, 12, 15, 18, 20].map(num => (
                          <button
                            key={num}
                            disabled={isLoading}
                            onClick={() => handleUpdateCardCount(num)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                              currentProject.cardCount === num 
                              ? 'bg-indigo-500 text-white scale-110 shadow-lg' 
                              : 'text-slate-500 hover:text-slate-300 disabled:opacity-50'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-32 flex flex-col items-center gap-8 bg-slate-50 rounded-[4rem] border-2 border-slate-100">
                      <div className="w-20 h-20 border-6 border-slate-900 border-t-indigo-500 rounded-full animate-spin"></div>
                      <p className="text-slate-900 font-black uppercase text-lg tracking-[0.4em]">Optimizing Assets</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                      {currentProject.images.map((demand, i) => (
                        <div key={i} className="bg-white border-2 border-slate-900 rounded-[3rem] flex flex-col hover:-translate-y-4 hover:shadow-[20px_20px_0px_0px_rgba(15,23,42,1)] transition-all duration-500 group overflow-hidden bg-[radial-gradient(#f1f5f9_2px,transparent_2px)] [background-size:28px_28px]">
                          <div className="p-8 bg-slate-700/90 backdrop-blur-sm flex justify-between items-center border-b-2 border-slate-900">
                            <div className="flex items-center gap-3">
                              <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse"></span>
                              <span className="text-sm font-black text-white uppercase tracking-[0.5em]">CARD P{demand.id}</span>
                            </div>
                            <span className="text-[11px] bg-slate-800 text-slate-100 px-4 py-1.5 rounded-full font-black tracking-widest border border-slate-600/50 uppercase">{demand.angle}</span>
                          </div>
                          
                          <div className="p-10 space-y-12 flex-1 flex flex-col text-left">
                            <div className="space-y-4">
                              <div className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] opacity-80">SLIDE MAIN COPY</div>
                              <div className="text-slate-900 font-black text-4xl leading-tight tracking-tight border-b-4 border-indigo-50 pb-5 group-hover:border-indigo-400 transition-colors">{demand.mainCopy}</div>
                            </div>

                            <div className="space-y-10 flex-1">
                              <div className="space-y-4">
                                <div className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">VISUAL STRATEGY</div>
                                <div className="text-slate-700 text-[16px] leading-relaxed font-bold border-l-4 border-slate-100 pl-5">{demand.modelDescription}</div>
                              </div>
                              <div className="space-y-4">
                                <div className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">STRUCTURAL DETAIL</div>
                                <div className="text-slate-900 text-[16px] leading-relaxed font-black italic underline decoration-indigo-100 underline-offset-[10px] decoration-[4px]">{demand.hatDetails}</div>
                              </div>
                            </div>

                            <div className="pt-10 border-t-2 border-slate-50 flex items-center justify-between">
                              <div className="bg-slate-50 px-6 py-3 rounded-2xl text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-4 shadow-sm border border-slate-100">
                                {demand.aestheticGoal}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <style>{`
        .fade-in { animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .knowledge-scroll::-webkit-scrollbar { width: 6px; }
        .knowledge-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 12px; }
      `}</style>
    </div>
  );
};

export default App;

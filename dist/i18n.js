'use strict';
(() => {
  // Source copy stays in the markup/app. These translations also cover dynamic dialogs.
  const rows = [
    ['Service chuno. Details WhatsApp par share karo.', 'Choose a service. Share your details on WhatsApp.', 'सेवा चुनें। अपनी जानकारी WhatsApp पर साझा करें।'],
    ['Kya chahiye? Service chunte hi WhatsApp chat khulegi.', 'What do you need? Choose a service to open WhatsApp.', 'क्या चाहिए? सेवा चुनते ही WhatsApp चैट खुलेगी।'],
    ['Gaadi track karne se kaam nahi chalega.', 'Tracking trucks is not enough.', 'सिर्फ गाड़ी ट्रैक करने से काम नहीं चलेगा।'],
    ['Trips execute karni padengi.', 'You need to complete the trip.', 'ट्रिप पूरी भी करनी पड़ेगी।'],
    ['FMS + AMS · FLEET & AGGREGATOR MANAGEMENT SYSTEM', null, 'FMS + AMS · फ्लीट और एग्रीगेटर प्रबंधन प्रणाली'],
    ['One platform to run your own trucks (FMS), control your market vendors and rates (AMS), and get on-ground rescue when a truck stops on the highway, all from one dashboard.', null, 'अपनी गाड़ियाँ चलाएँ (FMS), बाज़ार के वेंडर और किराये संभालें (AMS), और हाईवे पर गाड़ी रुकने पर मौके पर सहायता पाएँ—सब एक डैशबोर्ड से।'],
    ['Coverage & hours to be confirmed', null, 'सेवा क्षेत्र और समय की पुष्टि बाकी है'],
    ['NH-44 & NCR', null, 'NH-44 और NCR'],
    ['Gaadi ruki? Help now', 'Truck stopped? Get help', 'गाड़ी रुकी? सहायता लें'],
    ['Emergency Rescue: Abhi help chahiye', 'Emergency Rescue: Get help now', 'आपात सहायता: अभी मदद चाहिए'],
    ['Book FMS + AMS Demo', null, 'FMS + AMS का डेमो बुक करें'],
    ['Already on AMS? Log in', null, 'पहले से AMS पर हैं? लॉग इन करें'],
    ['AMS live', null, 'AMS उपलब्ध है'], ['GST-ready billing', null, 'GST के लिए तैयार बिलिंग'],
    ['Any truck, any brand', null, 'कोई भी ट्रक, कोई भी ब्रांड'],
    ['Built by an NH-44 transport family', null, 'NH-44 के परिवहन परिवार द्वारा निर्मित'],
    ['Sample trip', null, 'उदाहरण ट्रिप'], ['Hodal', null, 'होडल'], ['Delhi', null, 'दिल्ली'],
    ['HODAL', null, 'होडल'], ['PALWAL', null, 'पलवल'], ['DELHI', null, 'दिल्ली'],
    ['Loaded', null, 'माल लोड हो गया'], ['In transit', null, 'रास्ते में है'],
    ['Breakdown near Palwal', null, 'पलवल के पास गाड़ी खराब'], ['Mechanic assigned', null, 'मैकेनिक नियुक्त'], ['Back on road', null, 'फिर से सफर पर'],
    ['Tracking app: “Truck stopped.”', null, 'ट्रैकिंग ऐप: “ट्रक रुक गया।”'],
    ['TivraX: mechanic sent, truck back on road.', null, 'TivraX: मैकेनिक भेजा, ट्रक फिर सड़क पर।'],
    ['Replay trip', null, 'ट्रिप फिर से देखें'],
    ['Pehle raste ki problem, phir office ka system.', 'Roadside help first. Office systems next.', 'पहले रास्ते की समस्या, फिर ऑफिस का सिस्टम।'],
    ['Two ways to use TivraX.', null, 'TivraX इस्तेमाल करने के दो तरीके।'],
    ['Pick the one you need today.', null, 'आज जिसकी ज़रूरत है, उसे चुनें।'],
    ['TRACK 1 · NO SOFTWARE NEEDED', null, 'विकल्प 1 · सॉफ्टवेयर की ज़रूरत नहीं'],
    ['On-Demand Rescue & Support', null, 'ज़रूरत पड़ने पर सहायता और सहयोग'],
    ['Software baad mein dekhna. Pehle raste ki problem solve karo.', 'Software can wait. Resolve the roadside problem first.', 'सॉफ्टवेयर बाद में देखें। पहले रास्ते की समस्या सुलझाएँ।'],
    ['For when a truck is stuck right now, yours or hired. No signup, no app.', null, 'जब आपकी या किराये की गाड़ी रास्ते में फँस जाए। न साइनअप, न ऐप।'],
    ['Breakdown / mechanic', null, 'खराब गाड़ी / मैकेनिक'],
    ['Mistri on site: engine, electrical, air-brake, tyre', 'On-site mechanic: engine, electrical, air-brake, tyre', 'मौके पर मैकेनिक: इंजन, बिजली, एयर-ब्रेक और टायर'],
    ['Relief driver', null, 'वैकल्पिक ड्राइवर'],
    ['Driver beech raste chhod gaya? Verified driver, right DL class', 'Driver left mid-trip? Get a verified driver with the right licence class', 'ड्राइवर बीच रास्ते छोड़ गया? सही लाइसेंस श्रेणी वाला सत्यापित ड्राइवर पाएँ'],
    ['RTO / challan legal help', null, 'RTO / चालान की कानूनी सहायता'],
    ['Challan, gaadi zabt, RC seized: legal expert on call', 'Challan, impounded vehicle or seized RC: legal expert on call', 'चालान, जब्त गाड़ी या RC: कॉल पर कानूनी विशेषज्ञ'],
    ['Price batayenge pehle. Aap haan bolo, tab team niklegi.', 'You get the price first. The team leaves after you approve.', 'पहले कीमत बताएँगे। आपकी मंज़ूरी के बाद टीम निकलेगी।'],
    ['TRACK 2 · FOR THE OFFICE', null, 'विकल्प 2 · ऑफिस के लिए'],
    ['The Software Suite: FMS + AMS', null, 'सॉफ्टवेयर सूट: FMS + AMS'],
    ['WhatsApp groups aur Excel se business scale nahi hota.', 'Growing a business takes more than WhatsApp groups and Excel.', 'कारोबार बढ़ाने के लिए WhatsApp ग्रुप और Excel से आगे बढ़ें।'],
    ['Your own trucks in FMS. Your market vendors and rates in AMS. Rescue built into the workflow.', null, 'अपनी गाड़ियाँ FMS में। बाज़ार के वेंडर और किराये AMS में। सहायता भी उसी कार्यप्रवाह में।'],
    ['FMS · your own fleet', null, 'FMS · आपकी अपनी गाड़ियाँ'],
    ['Truck register, document vault, expiry alerts, driver assignments, trip status', null, 'ट्रक रजिस्टर, दस्तावेज़ भंडार, समाप्ति की सूचना, ड्राइवर नियुक्ति और ट्रिप स्थिति'],
    ['AMS · market vendors and rates', null, 'AMS · बाज़ार के वेंडर और किराये'],
    ['Vendor register, multi-vendor dispatch, GST billing. Rate controls to be confirmed.', null, 'वेंडर रजिस्टर, कई वेंडरों से डिस्पैच और GST बिलिंग। किराया नियंत्रण की पुष्टि बाकी है।'],
    ['Corporate return loads', null, 'कंपनियों से वापसी का माल'],
    ['Khali wapsi band: payment secured before you load, subject to availability', 'Reduce empty returns: payment secured before loading, subject to availability', 'खाली वापसी घटाएँ: उपलब्धता के अनुसार लोडिंग से पहले भुगतान सुरक्षित'],
    ['Explore AMS', null, 'AMS के बारे में जानें'], ['Seedhi baat.', 'A clear comparison.', 'सीधी बात।'],
    ["What you get, and what you don't,", null, 'किस विकल्प में क्या मिलता है,'], ['with each option.', null, 'और क्या नहीं मिलता।'],
    ['Comparison of TivraX, GPS apps and local brokers based on the supplied company positioning', null, 'कंपनी की जानकारी के आधार पर TivraX, GPS ऐप और स्थानीय ब्रोकरों की तुलना'],
    ['What matters on a trip', null, 'ट्रिप में क्या ज़रूरी है'], ['FMS + AMS + Rescue', null, 'FMS + AMS + सहायता'],
    ['GPS / tracking apps', null, 'GPS / ट्रैकिंग ऐप'], ['Local brokers &', null, 'स्थानीय ब्रोकर और'], ['WhatsApp groups', null, 'WhatsApp ग्रुप'],
    ['GPS apps', null, 'GPS ऐप'], ['Brokers', null, 'ब्रोकर'],
    ['Visibility: your own trucks', null, 'अपनी गाड़ियों की जानकारी'],
    ['Trip status pickup to POD, via your GPS or the driver’s phone', null, 'GPS या ड्राइवर के फोन से पिकअप से POD तक ट्रिप की स्थिति'],
    ['Strong: live location, reports, alerts', null, 'मज़बूत: लाइव लोकेशन, रिपोर्ट और अलर्ट'],
    ['Phone calls: “Kahan pahunche?”', 'Phone calls: “Where have you reached?”', 'फोन करके पूछना: “कहाँ पहुँचे?”'],
    ['Documents and expiries', null, 'दस्तावेज़ और वैधता'],
    ['Vault plus alerts before RC, permit, fitness, insurance lapse', null, 'दस्तावेज़ भंडार और RC, परमिट, फिटनेस, बीमा समाप्त होने से पहले सूचना'],
    ['Often included', null, 'अक्सर शामिल'], ['Register and memory', null, 'रजिस्टर और याददाश्त'],
    ['Market fleets (AMS)', null, 'बाज़ार की गाड़ियाँ (AMS)'],
    ['Vendor register, multi-vendor dispatch and billing', null, 'वेंडर रजिस्टर, कई वेंडरों से डिस्पैच और बिलिंग'],
    ['Usually not covered', null, 'आमतौर पर शामिल नहीं'], ['Strong network, all in chats and calls', null, 'मज़बूत नेटवर्क, लेकिन सब चैट और कॉल पर'],
    ['Rates and margin', null, 'किराये और मुनाफ़ा'], ['Rate-control scope to be confirmed in your demo', null, 'किराया नियंत्रण की सुविधाएँ डेमो में पुष्टि करें'],
    ['Not covered', null, 'शामिल नहीं'], ['In the broker’s head', null, 'ब्रोकर की याददाश्त में'],
    ['Raste ki problem: breakdown', 'Roadside problem: breakdown', 'रास्ते की समस्या: गाड़ी खराब'],
    ['Mechanic sent to the truck', null, 'गाड़ी के पास मैकेनिक भेजना'], ['Alert that the truck stopped', null, 'गाड़ी रुकने का अलर्ट'],
    ['Depends on who picks up', null, 'कौन फोन उठाता है, उस पर निर्भर'],
    ['Raste ki problem: driver walks off', 'Roadside problem: driver leaves', 'रास्ते की समस्या: ड्राइवर छोड़ गया'],
    ['Relief driver sent', null, 'वैकल्पिक ड्राइवर भेजना'], ['Ask around', null, 'जान-पहचान में पूछना'],
    ['Raste ki problem: challan / impound', 'Roadside problem: challan / impound', 'रास्ते की समस्या: चालान / गाड़ी जब्त'],
    ['Legal expert on call', null, 'कॉल पर कानूनी विशेषज्ञ'], ['Someone “knows someone”', null, 'किसी की जान-पहचान पर निर्भर'],
    ['Return loads', null, 'वापसी का माल'],
    ['Corporate loads, payment secured before loading; subject to availability', null, 'कंपनियों का माल, लोडिंग से पहले भुगतान सुरक्षित; उपलब्धता के अनुसार'],
    ['Not typical', null, 'आमतौर पर नहीं'], ['Yes, at commission; payment risk on you', null, 'हाँ, कमीशन पर; भुगतान का जोखिम आपका'],
    ['Where they’re stronger', null, 'कहाँ दूसरे विकल्प बेहतर हैं'],
    ['Initial focus: NH-44 and NCR; coverage to be confirmed', null, 'शुरुआती क्षेत्र: NH-44 और NCR; कवरेज की पुष्टि बाकी'],
    ['Deeper telematics and analytics', null, 'अधिक विस्तृत टेलीमैटिक्स और विश्लेषण'],
    ['Relationships built over years', null, 'वर्षों से बने संबंध'],
    ['Tracking batata hai gaadi kahan hai.', 'Tracking tells you where the truck is.', 'ट्रैकिंग बताती है गाड़ी कहाँ है।'],
    ['TivraX trip poori karwata hai.', 'TivraX helps complete the trip.', 'TivraX ट्रिप पूरी करवाता है।'],
    ['Comparison reflects company positioning; capabilities vary by provider. Rate controls and rescue coverage are subject to confirmation.', null, 'तुलना कंपनी की जानकारी पर आधारित है; सुविधाएँ सेवा प्रदाता के अनुसार अलग होंगी। किराया नियंत्रण और सहायता क्षेत्र की पुष्टि बाकी है।'],
    ['Ek load, ek system.', 'One load. One system.', 'एक लोड, एक सिस्टम।'],
    ['From order to POD,', null, 'ऑर्डर से POD तक,'], ['own truck or market truck.', null, 'अपनी गाड़ी हो या बाज़ार की।'],
    ['Apni gaadi', 'Own truck', 'अपनी गाड़ी'], ['Market gaadi', 'Market truck', 'बाज़ार की गाड़ी'],
    ['Order aaya', 'Order received', 'ऑर्डर आया'],
    ['Booking created in AMS, or a return load picked from your portal.', null, 'AMS में बुकिंग बनाएँ या पोर्टल से वापसी का माल चुनें।'],
    ['Gaadi lagi', 'Truck assigned', 'गाड़ी लगी'], ['Free truck and driver assigned from FMS.', null, 'FMS से उपलब्ध ट्रक और ड्राइवर नियुक्त करें।'],
    ['Load sent to your vendors, options compared, best one assigned.', null, 'वेंडरों को लोड भेजें, विकल्पों की तुलना करें और सही गाड़ी चुनें।'],
    ['Kaagaz ready', 'Documents ready', 'कागज़ तैयार'],
    ['RC, permit, insurance and e-way bill already in the vault.', null, 'RC, परमिट, बीमा और ई-वे बिल दस्तावेज़ भंडार में तैयार।'],
    ['Trip chal rahi hai', 'Trip in progress', 'ट्रिप जारी है'], ['Pickup to POD milestones on one screen.', null, 'पिकअप से POD तक हर चरण एक स्क्रीन पर।'],
    ['Raste mein problem?', 'Problem on the road?', 'रास्ते में समस्या?'],
    ['One tap: mechanic, relief driver or legal help, truck details pre-filled.', null, 'एक टैप पर मैकेनिक, वैकल्पिक ड्राइवर या कानूनी सहायता; गाड़ी की जानकारी पहले से भरी।'],
    ['Hisaab saaf', 'Accounts settled', 'हिसाब साफ'], ['POD uploaded, GST invoice raised.', null, 'POD अपलोड, GST चालान तैयार।'],
    ['POD uploaded, GST invoice raised, vendor balance recorded.', null, 'POD अपलोड, GST चालान तैयार और वेंडर का बकाया दर्ज।'],
    ['Khali wapsi band.', 'Fewer empty returns.', 'खाली वापसी बंद।'],
    ['Your truck goes out loaded.', null, 'गाड़ी माल लेकर जाती है।'], ['Bring it back loaded too.', null, 'वापस भी माल लेकर आए।'],
    ["Verified corporate return loads on your lane show up inside FMS and AMS when available. The shipper's payment is secured before you load, so there's no chasing bhada afterwards.", 'Verified corporate return loads on your lane appear in FMS and AMS when available. Payment is secured before loading, so there is no chasing freight payments afterwards.', 'आपके रूट पर उपलब्ध कंपनियों का सत्यापित वापसी माल FMS और AMS में दिखता है। लोडिंग से पहले भुगतान सुरक्षित होता है, ताकि बाद में भाड़े के लिए पीछा न करना पड़े।'],
    ['Depends on lane and availability.', null, 'रूट और उपलब्धता पर निर्भर।'], ['Road se bana hai.', 'Built from life on the road.', 'सड़क के अनुभव से बना है।'],
    ['01 / ROOTS', null, '01 / हमारी जड़ें'], ['02 / SOFTWARE', null, '02 / सॉफ्टवेयर'], ['03 / PEOPLE', null, '03 / लोग'], ['04 / CONTROL', null, '04 / नियंत्रण'],
    ['Built by an NH-44 transport family that runs its own and hired trucks.', null, 'NH-44 के ऐसे परिवहन परिवार ने बनाया, जो अपनी और किराये की गाड़ियाँ चलाता है।'],
    ['AMS live at', null, 'AMS यहाँ उपलब्ध है:'],
    ['Mechanics, drivers and legal experts verified before their first job.', null, 'मैकेनिक, ड्राइवर और कानूनी विशेषज्ञों का पहले काम से पूर्व सत्यापन।'],
    ['You approve the rescue price before anyone is dispatched.', null, 'टीम भेजने से पहले सहायता की कीमत आप मंज़ूर करते हैं।'],
    ['Jitna chahiye, utna lo.', 'Choose what you need.', 'जितना चाहिए, उतना लें।'], ['Pricing, without the guesswork.', null, 'कीमत की साफ जानकारी।'],
    ['Pricing', null, 'कीमतें'], ['Rescue', null, 'सहायता'], ['ON THE ROAD', null, 'रास्ते के लिए'], ['Rescue on demand', null, 'ज़रूरत पर सहायता'],
    ['Anyone, no account', null, 'सबके लिए, खाता ज़रूरी नहीं'], ['Per job', null, 'प्रति काम'], ['Price told upfront', null, 'कीमत पहले बताएँगे'],
    ['Abhi help chahiye', 'Get help now', 'अभी मदद चाहिए'], ['MARKET FLEETS', null, 'बाज़ार की गाड़ियाँ'],
    ['Brokers, transporters with market fleets', null, 'बाज़ार की गाड़ियाँ चलाने वाले ब्रोकर और ट्रांसपोर्टर'],
    ["Let's talk", null, 'बात करें'], ['Monthly pricing to be confirmed', null, 'मासिक कीमत की पुष्टि बाकी'], ['Discuss AMS', null, 'AMS के बारे में बात करें'],
    ['YOUR OWN TRUCKS', null, 'आपकी अपनी गाड़ियाँ'], ['Owners of their own trucks', null, 'अपनी गाड़ियों के मालिकों के लिए'],
    ['Early access', null, 'शुरुआती पहुँच'], ['Per-truck pricing to be confirmed', null, 'प्रति गाड़ी कीमत की पुष्टि बाकी'], ['Join early access', null, 'शुरुआती पहुँच के लिए जुड़ें'],
    ['THE COMPLETE SYSTEM', null, 'पूरा सिस्टम'], ['Transporters running both', null, 'दोनों तरह की गाड़ियाँ चलाने वाले ट्रांसपोर्टर'],
    ['Built for you', null, 'आपके लिए'], ['A plan around your operations', null, 'आपके काम के अनुसार योजना'], ['Book demo', null, 'डेमो बुक करें'],
    ["LET'S TALK TRIPS", null, 'ट्रिप की बात करें'], ['Rasta lamba hai.', 'The road is long.', 'रास्ता लंबा है।'], ['TivraX saath hai.', 'TivraX is with you.', 'TivraX साथ है।'],
    ['Book a 30-minute FMS + AMS demo on your own lanes and trucks.', null, 'अपने रूट और गाड़ियों के लिए 30 मिनट का FMS + AMS डेमो बुक करें।'],
    ['Name', null, 'नाम'], ['Mobile', null, 'मोबाइल'], ['Own trucks', null, 'अपनी गाड़ियाँ'], ['Market trucks / month', null, 'बाज़ार की गाड़ियाँ / महीना'],
    ['None', null, 'कोई नहीं'], ['Aapka naam', 'Your name', 'आपका नाम'],
    ['Preview mode · Forms prepare a downloadable draft; requests are not submitted yet.', null, 'पूर्वावलोकन · फॉर्म डाउनलोड करने योग्य मसौदा बनाते हैं; अनुरोध अभी जमा नहीं होते।'],
    ['Demo request ka draft ready hai.', 'Your demo request draft is ready.', 'डेमो अनुरोध का मसौदा तैयार है।'],
    ['Abhi company ko bheja nahi gaya. Download karke rakh lo; real contact details aane par send kar sakte ho.', 'This has not been sent to the company. Download the draft and contact us by phone or WhatsApp.', 'यह कंपनी को भेजा नहीं गया है। मसौदा डाउनलोड करें और फोन या WhatsApp पर संपर्क करें।'],
    ['Download request', null, 'अनुरोध डाउनलोड करें'], ['Details badlo', 'Edit details', 'जानकारी बदलें'], ['Move India Faster.', null, 'भारत को तेज़ी से आगे बढ़ाएँ।'],
    ['Rescue helpline', null, 'सहायता हेल्पलाइन'], ['Call or WhatsApp', null, 'कॉल या WhatsApp करें'],
    ['Website preview · service coverage & pricing subject to confirmation', null, 'वेबसाइट पूर्वावलोकन · सेवा क्षेत्र और कीमत की पुष्टि बाकी'],
    ['Gaadi ruki?', 'Truck stopped?', 'गाड़ी रुकी?'], ['Pehle raste ki problem solve karo.', 'Resolve the roadside problem first.', 'पहले रास्ते की समस्या सुलझाएँ।'], ['Help now', null, 'अभी मदद लें'],
    ['Gaadi ruki? Hum help bhejte hain.', 'Truck stopped? Get roadside help.', 'गाड़ी रुकी? सहायता पाएँ।'],
    ['Preview mode · No live dispatch. Requests are prepared as drafts.', null, 'पूर्वावलोकन · सीधे टीम नहीं भेजी जाती। अनुरोध मसौदे के रूप में तैयार होते हैं।'],
    ['Call now', null, 'अभी कॉल करें'], ['WhatsApp karo', 'Chat on WhatsApp', 'WhatsApp करें'],
    ['Ya yahin request taiyaar karo. Kya chahiye?', 'Or prepare a request here. What do you need?', 'या यहीं अनुरोध तैयार करें। क्या चाहिए?'],
    ['Mistri / breakdown', 'Mechanic / breakdown', 'मैकेनिक / गाड़ी खराब'],
    ['Engine, electrical, air-brake, tyre', null, 'इंजन, बिजली, एयर-ब्रेक, टायर'], ['Verified DL, right vehicle class', null, 'सत्यापित लाइसेंस, सही वाहन श्रेणी'],
    ['Legal / challan', null, 'कानूनी सहायता / चालान'], ['Challan, gaadi zabt, RC seized', 'Challan, impounded vehicle, seized RC', 'चालान, गाड़ी जब्त, RC जब्त'],
    ['Thoda detail do', 'Tell us a few details', 'थोड़ी जानकारी दें'], ['Gaadi number', 'Vehicle number', 'गाड़ी नंबर'],
    ['Location share karo', 'Share location', 'लोकेशन साझा करें'],
    ['GPS location mil gayi.', 'GPS location received.', 'GPS लोकेशन मिल गई।'],
    ['Abhi share nahi ki. Ya neeche landmark likh do.', 'Not shared yet. You can enter a landmark below.', 'अभी साझा नहीं की। या नीचे नज़दीकी स्थान लिखें।'],
    ['Location / landmark', null, 'लोकेशन / नज़दीकी स्थान'], ['Palwal toll ke 3 km aage', '3 km beyond Palwal toll', 'पलवल टोल से 3 किमी आगे'],
    ['Aage badho', 'Continue', 'आगे बढ़ें'], ['Service badlo', 'Change service', 'सेवा बदलें'],
    ['GPS available nahi hai. Landmark neeche likh do.', 'GPS is unavailable. Enter a landmark below.', 'GPS उपलब्ध नहीं है। नीचे नज़दीकी स्थान लिखें।'],
    ['Location dhoondh rahe hain…', 'Finding your location…', 'लोकेशन खोज रहे हैं…'],
    ['Location nahi mil paayi. Dhaba, toll ya km stone neeche likh do.', 'Could not get your location. Enter a dhaba, toll or kilometre marker below.', 'लोकेशन नहीं मिली। नीचे ढाबा, टोल या किलोमीटर का पत्थर लिखें।'],
    ['GPS share karo ya landmark likh do.', 'Share GPS or enter a landmark.', 'GPS साझा करें या नज़दीकी स्थान लिखें।'],
    ['Ek baat pehle', 'Before you continue', 'पहले एक बात'], ['Price pehle batayenge.', 'You approve the price first.', 'कीमत पहले बताएँगे।'],
    ['Aapki haan ke baad hi team niklegi. Abhi yeh preview hai; koi live booking ya dispatch nahi hogi.', 'The team leaves after your approval. This form is a preview; no live booking or dispatch will be made.', 'आपकी मंज़ूरी के बाद ही टीम निकलेगी। यह फॉर्म पूर्वावलोकन है; सीधे बुकिंग या टीम रवाना नहीं होगी।'],
    ['Service', null, 'सेवा'], ['Gaadi', 'Vehicle', 'गाड़ी'], ['Location', null, 'लोकेशन'],
    ['Request draft taiyaar karo', 'Prepare request draft', 'अनुरोध का मसौदा तैयार करें'],
    ['Request ka draft ready hai', 'Your request draft is ready', 'अनुरोध का मसौदा तैयार है'],
    ['Details ready. Agla step: company ko bhejna.', 'Details ready. Next: contact the company.', 'जानकारी तैयार। अगला कदम: कंपनी से संपर्क करें।'],
    ['Yeh request abhi submit nahi hui. Phone ya WhatsApp par humse sampark karo; automatic dispatch start nahi hua hai.', 'This request has not been submitted. Contact us by phone or WhatsApp; automatic dispatch has not started.', 'यह अनुरोध अभी जमा नहीं हुआ है। फोन या WhatsApp पर संपर्क करें; अपने-आप टीम भेजने की प्रक्रिया शुरू नहीं हुई है।'],
    ['Theek hai, band karo', 'Done, close', 'ठीक है, बंद करें'],
    ['Skip to content', null, 'मुख्य सामग्री पर जाएँ'], ['Main', null, 'मुख्य नेविगेशन'], ['TivraX home', null, 'TivraX होम'],
    ['Open navigation', null, 'मेन्यू खोलें'], ['Close navigation', null, 'मेन्यू बंद करें'], ['Illustrative trip workflow', null, 'उदाहरण ट्रिप का कार्यप्रवाह'],
    ['Compare options', null, 'विकल्पों की तुलना'], ['Truck type', null, 'गाड़ी का प्रकार'], ['Close emergency rescue', null, 'सहायता विंडो बंद करें'],
    ['Choose website language', null, 'वेबसाइट की भाषा चुनें'], ['Language', null, 'भाषा'],
    ['Enter a 10-digit Indian mobile number, optionally with +91', null, '10 अंकों का भारतीय मोबाइल नंबर दर्ज करें; +91 वैकल्पिक है']
  ];
  const dictionary = new Map(rows.map(([source, en, hi]) => [source, { en: en || source, hi }]));
  const supported = ['hinglish', 'en', 'hi'];
  let language = 'hinglish';
  try { const saved = localStorage.getItem('tivrax.language'); if (supported.includes(saved)) language = saved; } catch {}
  const textState = new WeakMap(), attributeState = new WeakMap();
  function translate(source) {
    const normalized = source.replace(/\s+/g, ' ').trim();
    if (!normalized || language === 'hinglish') return source;
    const direct = dictionary.get(normalized);
    if (direct) return source.replace(source.trim(), direct[language]);
    const match = normalized.match(/^([↻←]\s*)?(.*?)(\s*[↗→↓])?$/);
    const entry = match && dictionary.get(match[2]);
    if (entry) return `${match[1] || ''}${entry[language]}${match[3] || ''}`;
    if (normalized.startsWith('GPS location mil gayi:')) return normalized.replace('GPS location mil gayi:', language === 'hi' ? 'GPS लोकेशन मिल गई:' : 'GPS location received:');
    return source;
  }
  let observer;
  function applyLanguage() {
    observer?.disconnect();
    document.documentElement.lang = language === 'hinglish' ? 'hi-Latn' : language;
    document.documentElement.dataset.language = language;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.parentElement || node.parentElement.closest('script, style, .wordmark, [data-no-translate], input, textarea')) continue;
      const previous = textState.get(node);
      const source = previous && node.data === previous.output ? previous.source : node.data;
      const output = translate(source);
      if (node.data !== output) node.data = output;
      textState.set(node, { source, output });
    }
    document.querySelectorAll('[placeholder], [aria-label], [title]').forEach(element => {
      if (element.closest('[data-no-translate]')) return;
      const state = attributeState.get(element) || {};
      for (const name of ['placeholder', 'aria-label', 'title']) {
        if (!element.hasAttribute(name)) continue;
        const value = element.getAttribute(name), previous = state[name];
        const source = previous && value === previous.output ? previous.source : value;
        const output = translate(source);
        if (value !== output) element.setAttribute(name, output);
        state[name] = { source, output };
      }
      attributeState.set(element, state);
    });
    const selector = document.getElementById('language-select');
    if (selector) selector.value = language;
    document.title = language === 'hi' ? 'TivraX — FMS + AMS, हर ट्रिप पूरी करें' : 'TivraX — FMS + AMS, built to run trips';
    document.querySelectorAll('main [lang]').forEach(element => element.lang = document.documentElement.lang);
    observer?.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'placeholder', 'title'] });
  }
  let scheduled = false;
  observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => { scheduled = false; applyLanguage(); });
  });
  document.getElementById('language-select').addEventListener('change', event => {
    language = supported.includes(event.target.value) ? event.target.value : 'hinglish';
    try { localStorage.setItem('tivrax.language', language); } catch {}
    applyLanguage();
    document.dispatchEvent(new CustomEvent('tivrax:languagechange'));
  });
  window.TIVRAX_I18N = Object.freeze({
    translate,
    getLanguage: () => language,
    whatsappMessage: (serviceId) => {
      const names = {
        mechanic: { hinglish: 'Mistri / breakdown', en: 'Mechanic / breakdown', hi: 'मैकेनिक / गाड़ी खराब' },
        driver: { hinglish: 'Relief driver', en: 'Relief driver', hi: 'वैकल्पिक ड्राइवर' },
        legal: { hinglish: 'Legal / challan', en: 'Legal / challan', hi: 'कानूनी सहायता / चालान' }
      };
      const chosen = names[serviceId]?.[language];
      if (language === 'hi') return (chosen ? `नमस्ते TivraX, मुझे यह सेवा चाहिए: ${chosen}।` : 'नमस्ते TivraX, मुझे गाड़ी के लिए सहायता चाहिए।') + '\n\nनाम: \nमोबाइल: \nगाड़ी नंबर: \nलोकेशन / नज़दीकी स्थान: \nसमस्या की जानकारी: ';
      if (language === 'en') return (chosen ? `Hello TivraX, I need help with: ${chosen}.` : 'Hello TivraX, I need roadside assistance.') + '\n\nName: \nMobile: \nVehicle number: \nLocation / landmark: \nProblem details: ';
      return (chosen ? `Namaste TivraX, mujhe is service ki zaroorat hai: ${chosen}.` : 'Namaste TivraX, meri gaadi ke liye help chahiye.') + '\n\nNaam: \nMobile: \nGaadi number: \nLocation / landmark: \nProblem ki detail: ';
    }
  });
  applyLanguage();
})();
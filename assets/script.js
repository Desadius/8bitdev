(function(){
	function randomFrom(a){return a[Math.floor(Math.random()*a.length)]}

	const verbs = ["fix","add","update","remove","refactor","feat","chore","docs"]
	const scopes = ["ui","api","auth","tests","build","deps","ci","db"]
	const nouns = ["button","login","deploy","styles","README","parser","cache","script","flow","layout"]
	const types = ["feature","bugfix","hotfix","chore","docs"]

	function kebab(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}

	function generateCommitMessage(){
		const verb = randomFrom(verbs)
		const scope = Math.random() < 0.5 ? '('+randomFrom(scopes)+')' : ''
		const subject = randomFrom(nouns) + (Math.random()<0.4? ' ' + Math.floor(Math.random()*90+10): '')
		const prefix = Math.random()<0.15? '✨ ' : Math.random()<0.15? '🐛 ' : ''
		return prefix + verb + scope + ': ' + subject
	}

	function generateBranchName(){
		const t = randomFrom(types)
		const core = kebab(randomFrom(nouns) + '-' + Math.floor(Math.random()*900+100))
		return `${t}/${core}`
	}

	function generateGitCommands(){
		const branch = generateBranchName()
		const commit = generateCommitMessage()
		const flow = [
			`git checkout -b ${branch}`,
			'git add .',
			`git commit -m "${commit}"`,
			`git push --set-upstream origin ${branch}`
		]
		if(Math.random()<0.35) flow.push('gh pr create --fill')
		if(Math.random()<0.25) flow.push('git checkout main && git merge --no-ff ' + branch)
		return flow
	}

	function copyToClipboard(text){
		if(navigator.clipboard) return navigator.clipboard.writeText(text)
		const t = document.createElement('textarea')
		t.value = text
		document.body.appendChild(t)
		t.select()
		try{document.execCommand('copy')}catch(e){}
		t.remove()
		return Promise.resolve()
	}

	/* Contact form popup: shows a simple modal after submit */
	function showContactPopup(message){
		const overlay = document.createElement('div')
		overlay.setAttribute('role','dialog')
		Object.assign(overlay.style,{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(2,6,23,0.6)',zIndex:10000})

		const box = document.createElement('div')
		Object.assign(box.style,{background:'#071226',color:'#e6eef8',padding:'18px 22px',borderRadius:'12px',boxShadow:'0 12px 30px rgba(2,6,23,0.6)',maxWidth:'92%',textAlign:'center',fontSize:'16px'})

		const msg = document.createElement('div')
		msg.textContent = message
		msg.style.marginBottom = '12px'

		const ok = document.createElement('button')
		ok.textContent = 'OK'
		Object.assign(ok.style,{padding:'8px 14px',borderRadius:'8px',border:'none',background:'#2fb6ff',color:'#022',cursor:'pointer'})
		ok.addEventListener('click', ()=> overlay.remove())

		box.appendChild(msg)
		box.appendChild(ok)
		overlay.appendChild(box)
		document.body.appendChild(overlay)

		setTimeout(()=>{ try{ overlay.remove() }catch(e){} }, 4000)
	}

	function attachContactHandler(){
		const form = document.querySelector('.contact-form')
		if(!form) return
		form.addEventListener('submit', function(e){
			e.preventDefault()
			showContactPopup('Thank you for you message')
			try{ form.reset() }catch(err){}
		})
	}

	function buildPanel(){
		const panel = document.createElement('div')
		panel.className = 'git-practice-helper'
		Object.assign(panel.style,{position:'fixed',right:'12px',bottom:'12px',width:'320px',background:'#0b0f1a',color:'#e6eef8',padding:'12px',fontFamily:'Segoe UI, Arial, sans-serif',fontSize:'13px',borderRadius:'8px',boxShadow:'0 6px 18px rgba(2,6,23,0.6)',zIndex:9999})

		const title = document.createElement('div')
		title.textContent = 'Git Practice Helper'
		Object.assign(title.style,{fontWeight:700,marginBottom:'8px'})

		const commitEl = document.createElement('div')
		commitEl.style.marginBottom='8px'

		const branchEl = document.createElement('div')
		branchEl.style.marginBottom='8px'

		const cmdsEl = document.createElement('pre')
		Object.assign(cmdsEl.style,{whiteSpace:'pre-wrap',background:'#061026',padding:'8px',borderRadius:'6px',margin:'0 0 8px 0',fontSize:'12px'})

		const btnRow = document.createElement('div')
		btnRow.style.display='flex'
		btnRow.style.gap='6px'

		function newCommit(){commitEl.textContent = generateCommitMessage()}
		function newBranch(){branchEl.textContent = generateBranchName()}
		function newFlow(){cmdsEl.textContent = generateGitCommands().join('\n')}

		const bc = document.createElement('button')
		bc.textContent='Commit (G)'
		bc.onclick=newCommit
		const bb = document.createElement('button')
		bb.textContent='Branch (B)'
		bb.onclick=newBranch
		const bf = document.createElement('button')
		bf.textContent='Workflow (W)'
		bf.onclick=newFlow
		const cp = document.createElement('button')
		cp.textContent='Copy'
		cp.onclick=()=>{const text = cmdsEl.textContent||commitEl.textContent||branchEl.textContent; copyToClipboard(text)}

		[bc,bb,bf,cp].forEach(b=>{Object.assign(b.style,{flex:'1',padding:'8px 6px',borderRadius:'6px',border:'none',cursor:'pointer',background:'#142033',color:'#e6eef8'})})

		btnRow.append(bc,bb,bf,cp)

		panel.append(title,commitEl,branchEl,cmdsEl,btnRow)

		document.body.appendChild(panel)

		newCommit(); newBranch(); newFlow();

		window.addEventListener('keydown',e=>{
			if(e.target && ['INPUT','TEXTAREA'].includes(e.target.tagName)) return
			if(e.key.toLowerCase()==='g'){newCommit()}
			if(e.key.toLowerCase()==='b'){newBranch()}
			if(e.key.toLowerCase()==='w'){newFlow()}
		})
	}

	if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ buildPanel(); attachContactHandler() })
	else { buildPanel(); attachContactHandler() }

})();

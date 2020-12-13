window.onload = load();

function load() {
    let filter_check_state = document.getElementById('filter_check_state');
    let filter_select_state = document.getElementById('filter_select_state');

    selectState(filter_check_state.checked);
    filter_check_state.addEventListener('change', (e)=> {
        selectState(e.target.checked);

    })

    function selectState(check) {
        filter_select_state.disabled = check;
    }
}

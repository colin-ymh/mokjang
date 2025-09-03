import styled from 'styled-components';
import { BLACK, WHITE } from '../../../../../../../packages/constants/src';
import { MainText } from '../../../../../../../packages/components/src';

const FooterContainer = styled.footer`
  display: flex;
  height: 400px;
  background-color: ${BLACK};
  flex-shrink: 0;

  padding: 50px 100px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;

  align-items: center;
  justify-content: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const ColumnContainer = styled.div<{ flex: number }>`
  flex: ${({ flex }) => flex};
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const RowLine = styled.div`
  display: flex;
  width: 100%;
  height: 1px;
  background-color: ${WHITE};
  margin: 50px 0 30px 0;

  transform: scaleY(0.3); // 세로 두께 축소
  transform-origin: center;
`;

const ColumnList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RowList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
`;

export type FooterViewProps = {};

const FooterView = ({}: FooterViewProps) => {
  return (
    <>
      <FooterContainer>
        <Wrapper>
          <ContentContainer>
            <ColumnContainer flex={2}>
              <MainText color={WHITE} fontSize={24} fontWeight={600}>
                {'목장'}
              </MainText>
              <ColumnList>
                <MainText color={WHITE} fontSize={16} fontWeight={300}>
                  {'교회를 위한 최고의 교인관리와 일정관리 솔루션.'}
                </MainText>
              </ColumnList>
              <ColumnList>
                <MainText color={WHITE} fontSize={16} fontWeight={600}>
                  {'회사명'}
                  <MainText color={WHITE} fontSize={16} fontWeight={300}>
                    {': (주)작당'}
                  </MainText>
                </MainText>
                <MainText color={WHITE} fontSize={16} fontWeight={600}>
                  {'대표자'}
                  <MainText color={WHITE} fontSize={16} fontWeight={300}>
                    {': 나천호'}
                  </MainText>
                </MainText>
                <MainText color={WHITE} fontSize={16} fontWeight={600}>
                  {'사업자등록번호'}
                  <MainText color={WHITE} fontSize={16} fontWeight={300}>
                    {': 123-45-67890'}
                  </MainText>
                </MainText>
                <MainText color={WHITE} fontSize={16} fontWeight={600}>
                  {'주소'}
                  <MainText color={WHITE} fontSize={16} fontWeight={300}>
                    {': 경기도 부천시 원미구 중동로 254번길 90'}
                  </MainText>
                </MainText>
              </ColumnList>
            </ColumnContainer>
            <ColumnContainer flex={1}>
              <MainText color={WHITE} fontSize={18} fontWeight={600}>
                {'서비스'}
              </MainText>
              <ColumnList>
                <MainText color={WHITE} fontSize={16} fontWeight={300}>
                  {'교인관리'}
                </MainText>
                <MainText color={WHITE} fontSize={16} fontWeight={300}>
                  {'일정관리'}
                </MainText>
                <MainText color={WHITE} fontSize={16} fontWeight={300}>
                  {'출석관리'}
                </MainText>
                <MainText color={WHITE} fontSize={16} fontWeight={300}>
                  {'요금제'}
                </MainText>
              </ColumnList>
            </ColumnContainer>
            <ColumnContainer flex={1}>
              <MainText color={WHITE} fontSize={18} fontWeight={600}>
                {'고객지원'}
              </MainText>
              <ColumnList>
                <MainText color={WHITE} fontSize={16} fontWeight={300}>
                  {'문의하기'}
                </MainText>
                <MainText color={WHITE} fontSize={16} fontWeight={300}>
                  {'자주묻는질문'}
                </MainText>
                <MainText color={WHITE} fontSize={16} fontWeight={300}>
                  {'이메일 지원'}
                </MainText>
                <MainText color={WHITE} fontSize={16} fontWeight={300}>
                  {'전화 지원'}
                </MainText>
              </ColumnList>
            </ColumnContainer>
          </ContentContainer>
          <RowLine />
          <ContentContainer>
            <RowList>
              <MainText color={WHITE} fontSize={14} fontWeight={300}>
                {'개인정보 처리방침'}
              </MainText>
              <MainText color={WHITE} fontSize={14} fontWeight={300}>
                {'서비스 이용약관'}
              </MainText>
              <MainText color={WHITE} fontSize={14} fontWeight={300}>
                {'법적고지'}
              </MainText>
            </RowList>
            <MainText color={WHITE} fontSize={14} fontWeight={300}>
              {'© 2025 작당. All rights reserved.'}
            </MainText>
          </ContentContainer>
        </Wrapper>
      </FooterContainer>
    </>
  );
};

export default FooterView;
